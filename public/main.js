const BASE_URL = "/geo/v1.0";

const dataContainer = document.getElementById("data-container");
const divisionsCountEl = document.getElementById("divisions-count");
const districtsCountEl = document.getElementById("districts-count");
const upazilasCountEl = document.getElementById("upazilas-count");

const divisionSelect = document.getElementById("division-select");
const districtSelect = document.getElementById("district-select");
const upazilaSelect = document.getElementById("upazila-select");
const apiEndpointDisplay = document.getElementById("api-endpoint-display");

// Generic fetch function
async function fetchData(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
}

// Populate select element
function populateSelect(select, items, config = {}) {
  const {
    valueKey = null,
    nameKey = null,
    placeholder = "Select Option",
  } = config;
  resetSelect(select, placeholder);
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
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

divisionSelect.addEventListener("change", async () => {
  const division = divisionSelect.value;
  resetSelect(districtSelect, "Select District");
  resetSelect(upazilaSelect, "Select Upazila");

  if (!division) return updateApiEndpoint("/divisions");

  try {
    const endpoint = `/districts/${division}`;
    updateApiEndpoint(endpoint);
    const { data } = await fetchData(endpoint);
    populateSelect(districtSelect, data, {
      valueKey: "district",
      nameKey: "district",
      placeholder: "Select District",
    });
  } catch (err) {
    console.error("District load failed", err);
    resetSelect(districtSelect, "Failed to load");
  }
});

districtSelect.addEventListener("change", async () => {
  const district = districtSelect.value;
  resetSelect(upazilaSelect, "Select Upazila");

  if (!district) {
    updateApiEndpoint(`/districts/${divisionSelect.value}`);
    return;
  }

  try {
    const endpoint = `/upazilas/${district}`;
    updateApiEndpoint(endpoint);
    const { data } = await fetchData(endpoint);
    populateSelect(upazilaSelect, data, {
      valueKey: "upazila",
      nameKey: "upazila",
      placeholder: "Select Upazila",
    });
  } catch (err) {
    console.error("Upazila load failed", err);
    resetSelect(upazilaSelect, "Failed to load");
  }
});

upazilaSelect.addEventListener("change", () => {
  if (upazilaSelect.value) {
    updateApiEndpoint(`/upazilas/${districtSelect.value}`);
  }
});

function showLoader() {
  dataContainer.innerHTML = `
    <div class="loader-container">
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
  dataContainer.innerHTML = `
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      ${data
        .map(
          (item) => `
        <div class="bg-slate-50 border border-slate-200 rounded-md p-3 text-center hover:bg-slate-100 hover:border-slate-300 transition-all">
          <p class="font-semibold text-slate-800 py-3">${item}</p>
        </div>`
        )
        .join("")}
    </div>`;
}

async function loadInitialData() {
  showLoader();
  try {
    const [divisions, districts, upazilas] = await Promise.all([
      fetchData("/divisions"),
      fetchData("/districts"),
      fetchData("/upazilas"),
    ]);

    divisionsCountEl.textContent = divisions.data?.length ?? 0;
    districtsCountEl.textContent = districts.data?.length
      ? `${districts.data.length}`
      : 0;
    upazilasCountEl.textContent = upazilas.data?.length
      ? `${upazilas.data.length}`
      : 0;

    populateSelect(divisionSelect, divisions.data, {
      valueKey: "division",
      nameKey: "division",
      placeholder: "Select Division",
    });

    showData(divisions.data);
  } catch (err) {
    console.error("Initial data load failed:", err);
    showError();
    divisionsCountEl.textContent = "Error";
    districtsCountEl.textContent = "Error";
    upazilasCountEl.textContent = "Error";
  }
}

window.onload = loadInitialData;
