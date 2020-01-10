const INTERFACE = "Interface";
const CAPABILITY_MODEL = "CapabilityModel";
const IS_PUBLIC_URL = "?public";
const VALUE = "value";
const ALL = "All";

const repository = new Vue({
  el: "#main",
  data: {
    companyName:
      _location.search === IS_PUBLIC_URL
        ? "Public repository"
        : "Company repository",
    selectedInterfaces: {
      value: []
    },
    interfaceList: {
      value: []
    },
    selectedCapabilityModels: {
      value: []
    },
    capabilityList: {
      value: []
    },
    type: {
      value: CAPABILITY_MODEL
    },
    interfaceNextToken: {
      value: ""
    },
    capabilityNextToken: {
      value: ""
    },
    showSearchBar: false,
    showStatusSelector: false,
    showTagSelector: false,
    filterStatus: ALL,
    filterTags: [],
    filterKeywords: "",
    searchKeywords: "",
    filterTagsOrAnd: "and",
    loadingDigitalTwinInterfaces: {
      value: true
    },
    loadingDigitalTwinCapabilityModels: {
      value: true
    },
    allTags: {
      value: [
        "tag1",
        "tag2",
        "tag3",
        "tag11",
        "tag12",
        "tag13",
        "tag21",
        "tag22",
        "tag23",
        "tag31",
        "tag32",
        "tag33"
      ]
    },
    filterTagsKeywords: "",
    nextPageLoadingCounter: null,
    publicRepository: _location.search === IS_PUBLIC_URL
  },
  methods: {
    command,
    highlight: function(value) {
      value = encodeHTML(value);
      const filterKeywords = encodeHTML(this.filterKeywords.trim());
      if (!filterKeywords) {
        return value;
      }
      const filterReg = new RegExp(`(${filterKeywords})`, "ig");
      return value.replace(filterReg, "<em>$1</em>");
    },
    createDigitalTwinFile,
    deleteDigitalTwinFiles,
    editDigitalTwinFiles,
    getNextPageDigitalTwinFiles,
    refreshDigitalTwinFileList,
    showHideSearchBar,
    showHideStatusSelector,
    showHideTagSelector,
    clearFilter,
    selectFilterStatus,
    addRemoveInterface,
    addRemoveCapability,
    filterItems,
    onScrollTable,
    searchTags,
    copy,
    hasNoItemToPublish,
    searchOnServer,
    clearKeywords
  },
  created: function() {
    getNextPageDigitalTwinFiles.call(this, INTERFACE);
    getNextPageDigitalTwinFiles.call(this, CAPABILITY_MODEL);
  }
});

function encodeHTML(value) {
  let div = document.createElement("div");
  div.innerText = value;
  const html = div.innerHTML;
  div = undefined;
  return html;
}

function deleteDigitalTwinFiles() {
  const fileIds =
    this.type.value === INTERFACE
      ? this.selectedInterfaces.value
      : this.selectedCapabilityModels.value;
  command(
    "azure-digital-twins.deleteModels",
    this.publicRepository,
    fileIds,
    refreshDigitalTwinFileList.bind(this)
  );
}

function editDigitalTwinFiles() {
  const fileIds =
    this.type.value === INTERFACE
      ? this.selectedInterfaces.value
      : this.selectedCapabilityModels.value;
  command(
    "azure-digital-twins.downloadModels",
    this.publicRepository,
    fileIds,
    refreshDigitalTwinFileList.bind(this)
  );
}

function createDigitalTwinFile() {
  const commandName =
    this.type.value === INTERFACE
      ? "azure-digital-twins.createInterface"
      : "azure-digital-twins.createCapabilityModel";
  command(commandName);
}

function getNextPageDigitalTwinFiles(fileType) {
  fileType = typeof fileType === "string" ? fileType : this.type.value;
  let commandName, fileList, nextToken, loadingDigitalTwinFiles;

  if (fileType === INTERFACE) {
    commandName = "azure-digital-twins.searchInterface";
    fileList = this.interfaceList;
    nextToken = this.interfaceNextToken;
    loadingDigitalTwinFiles = this.loadingDigitalTwinInterfaces;
    tableId = "interfaceListTable";
  } else {
    commandName = "azure-digital-twins.searchCapabilityModel";
    fileList = this.capabilityList;
    nextToken = this.capabilityNextToken;
    loadingDigitalTwinFiles = this.loadingDigitalTwinCapabilityModels;
    tableId = "capabilityListTable";
  }

  loadingDigitalTwinFiles.value = true;
  command(
    commandName,
    this.publicRepository,
    this.searchKeywords,
    50,
    nextToken.value,
    res => {
      Vue.set(fileList, VALUE, fileList.value.concat(res.result.results));
      Vue.set(nextToken, VALUE, res.result.continuationToken);
      Vue.set(loadingDigitalTwinFiles, VALUE, false);
    }
  );
}

function refreshDigitalTwinFileList() {
  let nextToken, selectedList;
  if (this.type.value === INTERFACE) {
    fileList = this.interfaceList;
    nextToken = this.interfaceNextToken;
    selectedList = this.selectedInterfaces;
    loadingDigitalTwinFiles = this.loadingDigitalTwinInterfaces;
  } else {
    fileList = this.capabilityList;
    nextToken = this.capabilityNextToken;
    selectedList = this.selectedCapabilityModels;
    loadingDigitalTwinFiles = this.loadingDigitalTwinCapabilityModels;
  }

  Vue.set(fileList, VALUE, []);
  Vue.set(nextToken, VALUE, "");
  Vue.set(selectedList, VALUE, []);
  Vue.set(loadingDigitalTwinFiles, VALUE, true);
  setTimeout(getNextPageDigitalTwinFiles.bind(this), 1000); // wait for server refresh
}

function showHideSearchBar() {
  this.showSearchBar = !this.showSearchBar;
  this.showStatusSelector = false;
  this.showTagSelector = false;
}

function showHideStatusSelector() {
  this.showStatusSelector = !this.showStatusSelector;
  this.showTagSelector = false;
}

function showHideTagSelector() {
  this.showTagSelector = !this.showTagSelector;
  this.showStatusSelector = false;
}

function clearFilter() {
  this.filterTags = [];
  this.filterStatus = ALL;
  this.showStatusSelector = false;
  this.filterKeywords = "";
  this.showTagSelector = false;
}

function selectFilterStatus(status) {
  this.filterStatus = status;
  this.showStatusSelector = false;
}

function addRemoveInterface(id) {
  const index = this.selectedInterfaces.value.indexOf(id);
  if (index !== -1) {
    this.selectedInterfaces.value.splice(index, 1);
  } else {
    this.selectedInterfaces.value.push(id);
  }
}

function addRemoveCapability(id) {
  const index = this.selectedCapabilityModels.value.indexOf(id);
  if (index !== -1) {
    this.selectedCapabilityModels.value.splice(index, 1);
  } else {
    this.selectedCapabilityModels.value.push(id);
  }
}

function searchTags(tags) {
  const filterTagsKeywords = this.filterTagsKeywords.trim();
  if (!filterTagsKeywords) {
    return tags;
  }

  return tags.filter(tag => {
    return tag.toLowerCase().indexOf(filterTagsKeywords.toLowerCase()) !== -1;
  });
}

function filterItems(list) {
  if (!this.showSearchBar) {
    return list;
  }

  const filterKeywords = this.filterKeywords.trim();
  const filterStatus = this.filterStatus;
  const filterTags = this.filterTags;
  const filterTagsOrAnd = this.filterTagsOrAnd;

  return list.filter(item => {
    if (filterStatus !== ALL) {
      if (item.published && filterStatus !== "Published") {
        return false;
      }
      if (!item.published && filterStatus !== "Saved") {
        return false;
      }
    }

    if (!isMatchTags(item.tags, filterTags, filterTagsOrAnd)) {
      return false;
    }

    if (!item.displayName) {
      return false;
    }

    const displayName = item.displayName;
    const urnId = item.urnId;
    if (
      filterKeywords &&
      displayName.toLowerCase().indexOf(filterKeywords.toLowerCase()) === -1 &&
      urnId.toLowerCase().indexOf(filterKeywords.toLowerCase()) === -1
    ) {
      return false;
    }

    return true;
  });
}

function isMatchTags(tags, selectedTags, orAnd) {
  if ((!tags || !tags.length) && selectedTags.length) {
    return false;
  }
  if (!selectedTags.length) {
    return true;
  }

  for (tag of selectedTags) {
    const index = tags.indexOf(tag);
    if (index === -1 && orAnd === "and") {
      return false;
    }
    if (index !== -1 && orAnd === "or") {
      return true;
    }
    if (index !== -1 && orAnd === "and") {
      tags.splice(index, 1);
    }
  }

  if (orAnd === "or") {
    return false;
  }

  if (orAnd === "and" && !tags.length) {
    return true;
  }

  return false;
}

function onScrollTable(event) {
  if (this.filterKeywords) {
    return;
  }
  const nextToken =
    this.type.value === INTERFACE
      ? this.interfaceNextToken.value
      : this.capabilityNextToken.value;
  const loadingDigitalTwinFiles =
    this.type.value === INTERFACE
      ? this.loadingDigitalTwinInterfaces
      : this.loadingDigitalTwinCapabilityModels;
  if (
    !nextToken ||
    this.nextPageLoadingCounter ||
    loadingDigitalTwinFiles.value
  ) {
    return;
  }
  this.nextPageLoadingCounter = setTimeout(() => {
    const totalHeight = event.target.scrollHeight;
    const heightOffset = event.target.scrollTop;
    const viewHeight = event.target.offsetHeight;
    if (viewHeight + heightOffset >= totalHeight) {
      this.getNextPageDigitalTwinFiles(this.type);
    }
    this.nextPageLoadingCounter = null;
  }, 1000);
}

function copy(event, content) {
  const copyTextBox = document.createElement("input");
  copyTextBox.className = "copy-text-box";
  copyTextBox.value = content;
  document.body.appendChild(copyTextBox);
  copyTextBox.select();
  document.execCommand("copy");
  document.body.removeChild(copyTextBox);
  event.target.className = "copy_icon copied";
  setTimeout(() => {
    event.target.className = "copy_icon";
  }, 500);
}

function hasNoItemToPublish() {
  let selectedItemList, fullItemList;
  if (this.type.value === INTERFACE) {
    fullItemList = this.interfaceList.value;
    selectedItemList = this.selectedInterfaces.value;
  } else {
    fullItemList = this.capabilityList.value;
    selectedItemList = this.selectedCapabilityModels.value;
  }

  for (let i = 0; i < selectedItemList.length; i++) {
    const item = fullItemList.find(item => item.id === selectedItemList[i]);
    if (item && !item.published) {
      return false;
    }
  }
  return true;
}

function searchOnServer() {
  this.searchKeywords = this.filterKeywords;
  this.filterKeywords = "";
  this.refreshDigitalTwinFileList();
}

function clearKeywords() {
  this.searchKeywords = "";
  this.filterKeywords = "";
  this.refreshDigitalTwinFileList();
}
