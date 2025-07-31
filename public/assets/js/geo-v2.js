const BASE_URL = "/geo/v2.0";

const dataContainer = document.getElementById("data-container");
const divisionsCountEl = document.getElementById("divisions-count");
const districtsCountEl = document.getElementById("districts-count");
const upazilasCountEl = document.getElementById("upazilas-count");
const unionsCountEl = document.getElementById("unions-count");

const divisionSelect = document.getElementById("division-select");
const districtSelect = document.getElementById("district-select");
const upazilaSelect = document.getElementById("upazila-select");
const unionSelect = document.getElementById("union-select");
const apiEndpointDisplay = document.getElementById("api-endpoint-display");

// Generic fetch function
async function fetchData(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
}

function populateSelect(select, items, config = {}) {
  const { valueKey = null, nameKey = null, placeholder = "Select Option" } = config;
  resetSelect(select, placeholder);
  items.forEach((item) => {
    const option = document.createElement("option");
    if (typeof item === "object" && valueKey && nameKey) {
      option.value = item[valueKey];
      option.textContent = item[nameKey];
    } else {
      option.value = item;
      option.textContent = item;
    }
    select.appendChild(option);
  });
  select.disabled = false;
}

function resetSelect(select, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  select.disabled = true;
}

function updateApiEndpoint(endpoint) {
  apiEndpointDisplay.textContent = endpoint;
}

// Dropdown event listeners

divisionSelect.addEventListener("change", async () => {
  const division = divisionSelect.value;
  resetSelect(districtSelect, "Select District");
  resetSelect(upazilaSelect, "Select Upazila");
  resetSelect(unionSelect, "Select Union");

  if (!division) {
    updateApiEndpoint("/divisions");
    showData([]);
    return;
  }

  try {
    const endpoint = `/districts/${division}`;
    updateApiEndpoint(endpoint);
    const { data } = await fetchData(endpoint);
    populateSelect(districtSelect, data, { valueKey: "id", nameKey: "name", placeholder: "Select District" });
    showData(data.map(d => d.name));
  } catch (err) {
    console.error("District load failed", err);
    resetSelect(districtSelect, "Failed to load");
    showError();
  }
});

districtSelect.addEventListener("change", async () => {
  const district = districtSelect.value;
  resetSelect(upazilaSelect, "Select Upazila");
  resetSelect(unionSelect, "Select Union");

  if (!district) {
    updateApiEndpoint(`/districts/${divisionSelect.value}`);
    showData([]);
    return;
  }

  try {
    const endpoint = `/upazilas/${district}`;
    updateApiEndpoint(endpoint);
    const { data } = await fetchData(endpoint);
    populateSelect(upazilaSelect, data, { valueKey: "id", nameKey: "name", placeholder: "Select Upazila" });
    showData(data.map(u => u.name));
  } catch (err) {
    console.error("Upazila load failed", err);
    resetSelect(upazilaSelect, "Failed to load");
    showError();
  }
});

upazilaSelect.addEventListener("change", async () => {
  const upazila = upazilaSelect.value;
  resetSelect(unionSelect, "Select Union");

  if (!upazila) {
    updateApiEndpoint(`/upazilas/${districtSelect.value}`);
    showData([]);
    return;
  }

  try {
    const endpoint = `/unions/${upazila}`;
    updateApiEndpoint(endpoint);
    const { data } = await fetchData(endpoint);
    populateSelect(unionSelect, data, { valueKey: "id", nameKey: "name", placeholder: "Select Union" });
    showData(data.map(u => u.name));
  } catch (err) {
    console.error("Union load failed", err);
    resetSelect(unionSelect, "Failed to load");
    showError();
  }
});

unionSelect.addEventListener("change", () => {
  if (unionSelect.value) {
    updateApiEndpoint(`/unions/${upazilaSelect.value}`);
  }
});

function showLoader() {
  dataContainer.innerHTML = `
    <div class="loader-container flex justify-center items-center min-h-[100px]">
      <div class="loader"></div>
    </div>`;
}

function showError() {
  dataContainer.innerHTML = `
    <div class="error-box p-4 rounded-lg flex justify-between items-center">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 class="font-bold">Error</h4>
          <p class="text-sm">Failed to fetch</p>
        </div>
      </div>
      <button onclick="loadInitialData()" class="font-medium text-sm flex items-center gap-1 hover:underline">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h5M20 20v-5h-5" />
          <path d="M4 9a9 9 0 0114.24-5.66m-1.48 12.32A9 9 0 014 9" />
        </svg>
        Retry
      </button>
    </div>`;
}

function showData(data) {
  if (!data || data.length === 0) {
    dataContainer.innerHTML = `<div class="text-center text-slate-400">No data to display.</div>`;
    return;
  }
  dataContainer.innerHTML = `
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      ${data.map(item => `<div class="bg-slate-50 border border-slate-200 rounded-md p-3 text-center hover:bg-slate-100 hover:border-slate-300 transition-all"><p class="font-semibold text-slate-800 py-3">${item}</p></div>`).join("")}
    </div>`;
}

async function loadInitialData() {
  showLoader();
  try {
    // Load all divisions for initial state
    const { data: divisions } = await fetchData("/divisions");
    populateSelect(divisionSelect, divisions, { valueKey: "id", nameKey: "name", placeholder: "Select Division" });
    updateApiEndpoint("/divisions");
    showData(divisions.map(d => d.name));
  } catch (err) {
    console.error("Initial data load failed:", err);
    showError();
  }
}

window.onload = loadInitialData; 