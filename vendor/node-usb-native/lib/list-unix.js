'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

function promisify(func) {
  return (arg) => {
    return new Promise((resolve, reject) => {
      func(arg, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  };
}

function promisedFilter(func) {
  return (data) => {
    const shouldKeep = data.map(func);
    return Promise.all(shouldKeep).then((keep) => {
      return data.filter((path, index) => {
        return keep[index];
      });
    });
  };
}

const statAsync = promisify(fs.stat);
const readdirAsync = promisify(fs.readdir);
const execAsync = promisify(childProcess.exec);

function udevParser(output) {
  const udevInfo = output.split('\n').reduce((info, line) => {
    if (!line || line.trim() === '') {
      return info;
    }
    const parts = line.split('=').map((part) => {
      return part.trim();
    });

    info[parts[0].toLowerCase()] = parts[1];

    return info;
  }, {});

  let pnpId;
  if (udevInfo.devlinks) {
    udevInfo.devlinks.split(' ').forEach((path) => {
      if (path.indexOf('/by-id/') === -1) { return }
      pnpId = path.substring(path.lastIndexOf('/') + 1);
    });
  }

  let vendorId = udevInfo.id_vendor_id;
  if (vendorId && vendorId.substring(0, 2) !== '0x') {
    vendorId = `0x${vendorId}`;
  }

  let productId = udevInfo.id_model_id;
  if (productId && productId.substring(0, 2) !== '0x') {
    productId = `0x${productId}`;
  }

  return {
    comName: udevInfo.devname,
    manufacturer: udevInfo.id_vendor,
    serialNumber: udevInfo.id_serial,
    pnpId: pnpId,
    vendorId: vendorId,
    productId: productId
  };
}

function checkPathAndDevice(path) {
  // get only serial port names
  if (!(/(tty(S|ACM|USB|AMA|MFD)|rfcomm)/).test(path)) {
    return false;
  }
  return statAsync(path).then((stats) => {
    return stats.isCharacterDevice();
  });
}

function lookupPort(file) {
  const udevadm = `udevadm info --query=property -p $(udevadm info -q path -n ${file})`;
  return execAsync(udevadm).then(udevParser);
}

function listUnix(callback) {
  const dirName = '/dev';
  readdirAsync(dirName)
    .catch((err) => {
      // if this directory is not found we just pretend everything is OK
      // TODO Depreciated this check?
      if (err.errno === 34) {
        return [];
      }
      throw err;
    })
    .then((data) => { return data.map((file) => { return path.join(dirName, file) }) })
    .then(promisedFilter(checkPathAndDevice))
    .then((data) => { return Promise.all(data.map(lookupPort)) })
    .then((data) => { callback(null, data) }, (err) => { callback(err) });
}

module.exports = listUnix;
