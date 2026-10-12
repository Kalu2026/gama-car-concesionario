/*
 * GAMA Concesionario — interacciones de la página de inicio.
 * IMPORTANTE ANTES DE PUBLICAR:
 * 1. Cambia WHATSAPP_NUMBER por el WhatsApp oficial en formato internacional,
 *    solo números. Colombia: 57 + número celular (ej. 573001234567).
 * 2. Sustituye los vehículos de demostración por el inventario real confirmado.
 * 3. Revisa textos, precios, fotos, aviso de privacidad y datos de contacto.
 */
(() => {
  "use strict";

  const WHATSAPP_NUMBER = ""; // Ejemplo de formato: "573001234567". No incluir +, espacios ni guiones.

  // Datos demostrativos: no representan ofertas reales de GAMA.
  // Cambia o agrega objetos siguiendo este mismo formato.
  const vehicles = [
    {
      id: "suv-01", brand: "Toyota", model: "Land Cruiser Prado", version: "TX-L 4x4", year: 2022,
      price: 285000000, category: "SUV", transmission: "Automática", mileage: 38500, fuel: "Gasolina",
      badge: "Destacado", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=82", alt: "Camioneta SUV gris, imagen ilustrativa"
    },
    {
      id: "pickup-01", brand: "Toyota", model: "Hilux", version: "4x4 diésel", year: 2023,
      price: 198000000, category: "Pickup", transmission: "Manual", mileage: 24500, fuel: "Diésel",
      badge: "Opción destacada", image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1000&q=82", alt: "Pick-up sobre carretera, imagen ilustrativa"
    },
    {
      id: "sedan-01", brand: "Mazda", model: "Mazda 3", version: "Grand Touring", year: 2021,
      price: 92500000, category: "Sedán", transmission: "Automática", mileage: 42000, fuel: "Gasolina",
      badge: "Buena opción", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=82", alt: "Sedán deportivo rojo, imagen ilustrativa"
    },
    {
      id: "hatch-01", brand: "Chevrolet", model: "Onix", version: "Turbo LT", year: 2022,
      price: 63500000, category: "Hatchback", transmission: "Manual", mileage: 31500, fuel: "Gasolina",
      badge: "Compacto", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=82", alt: "Carro compacto deportivo, imagen ilustrativa"
    },
    {
      id: "suv-02", brand: "Renault", model: "Duster", version: "Intens 4x2", year: 2023,
      price: 89500000, category: "SUV", transmission: "Automática", mileage: 19000, fuel: "Gasolina",
      badge: "Muy versátil", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=82", alt: "SUV estacionada al aire libre, imagen ilustrativa"
    },
    {
      id: "pickup-02", brand: "Ford", model: "Ranger", version: "XLT 4x4", year: 2021,
      price: 159000000, category: "Pickup", transmission: "Automática", mileage: 51000, fuel: "Diésel",
      badge: "Lista para viajar", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=82", alt: "Vehículo de aventura frente a paisaje, imagen ilustrativa"
    }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const grid = $("#vehicleGrid");
  const resultCount = $("#resultsCount");
  const emptyState = $("#emptyState");
  const searchInput = $("#vehicleSearch");
  const brandFilter = $("#brandFilter");
  const sortFilter = $("#sortFilter");
  const categoryFilters = $("#categoryFilters");
  const quickType = $("#quickType");
  const quickBrand = $("#quickBrand");
  const quickBudget = $("#quickBudget");
  let activeCategory = "";
  let toastTimeout;

  const formatCOP = amount => new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0
  }).format(amount);

  const normalize = text => String(text ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 4200);
  }

  function createWhatsAppUrl(message) {
    const encodedMessage = encodeURIComponent(message);
    const number = WHATSAPP_NUMBER.replace(/\D/g, "");
    return number
      ? `https://wa.me/${number}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
  }

  function openWhatsApp(message) {
    const url = createWhatsAppUrl(message);
    const popup = window.open(url, "_blank", "noopener,noreferrer");
    if (!popup) window.location.href = url;
    if (!WHATSAPP_NUMBER) {
      showToast("Recuerda configurar el WhatsApp oficial en script.js. El mensaje está preparado para continuar.");
    }
  }

  function populateBrandOptions() {
    const brands = [...new Set(vehicles.map(vehicle => vehicle.brand))].sort((a, b) => a.localeCompare(b, "es"));
    [brandFilter, quickBrand].forEach(select => {
      if (!select) return;
      const firstOption = select.querySelector("option[value='']");
      select.replaceChildren(firstOption || new Option("Todas las marcas", ""));
      brands.forEach(brand => select.add(new Option(brand, brand)));
    });
  }

  function renderVehicle(vehicle) {
    const card = document.createElement("article");
    card.className = "vehicle-card";
    card.innerHTML = `
      <div class="vehicle-image">
        <img src="${vehicle.image}" alt="${vehicle.alt}" width="1000" height="700" loading="lazy">
        <span class="vehicle-tag">${vehicle.badge}</span>
        <span class="vehicle-year">Modelo ${vehicle.year}</span>
      </div>
      <div class="vehicle-body">
        <p class="vehicle-brand">${vehicle.brand}</p>
        <h3 class="vehicle-title">${vehicle.model}</h3>
        <div class="vehicle-meta">
          <span><i class="meta-dot" aria-hidden="true"></i>${vehicle.version}</span>
          <span><i class="meta-dot" aria-hidden="true"></i>${vehicle.transmission}</span>
          <span><i class="meta-dot" aria-hidden="true"></i>${vehicle.mileage.toLocaleString("es-CO")} km</span>
        </div>
        <div class="vehicle-bottom">
          <div><span class="vehicle-price-label">Precio ilustrativo</span><strong class="vehicle-price">${formatCOP(vehicle.price)}</strong></div>
          <button class="vehicle-ask" type="button" data-vehicle-id="${vehicle.id}">Consultar <span aria-hidden="true">↗</span></button>
        </div>
      </div>`;
    return card;
  }

  function getVisibleVehicles() {
    const query = normalize(searchInput?.value || "");
    const brand = brandFilter?.value || "";
    const maxBudget = quickBudget?.value ? Number(quickBudget.value) : Infinity;
    let filtered = vehicles.filter(vehicle => {
      const searchable = normalize(`${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year} ${vehicle.category}`);
      return (!query || searchable.includes(query))
        && (!brand || vehicle.brand === brand)
        && (!activeCategory || vehicle.category === activeCategory)
        && vehicle.price <= maxBudget;
    });

    const sort = sortFilter?.value || "featured";
    if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    else if (sort === "year-desc") filtered.sort((a, b) => b.year - a.year || a.price - b.price);
    return filtered;
  }

  function updateCategoryButtons() {
    $$(".filter-chip", categoryFilters).forEach(button => {
      const isActive = button.dataset.category === activeCategory;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function renderInventory() {
    if (!grid) return;
    const visible = getVisibleVehicles();
    grid.replaceChildren(...visible.map(renderVehicle));
    if (resultCount) resultCount.textContent = `Mostrando ${visible.length} de ${vehicles.length} vehículos de muestra`;
    if (emptyState) emptyState.hidden = visible.length > 0;
    grid.hidden = visible.length === 0;
    updateCategoryButtons();
  }

  function clearFilters() {
    if (searchInput) searchInput.value = "";
    if (brandFilter) brandFilter.value = "";
    if (quickBrand) quickBrand.value = "";
    if (quickType) quickType.value = "";
    if (quickBudget) quickBudget.value = "";
    if (sortFilter) sortFilter.value = "featured";
    activeCategory = "";
    renderInventory();
  }

  // Menú móvil
  const menuToggle = $("#menuToggle");
  const primaryNav = $("#primaryNav");
  function closeMenu() {
    primaryNav?.classList.remove("is-open");
    menuToggle?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menú");
    document.body.classList.remove("menu-open");
  }
  menuToggle?.addEventListener("click", () => {
    const willOpen = !primaryNav?.classList.contains("is-open");
    primaryNav?.classList.toggle("is-open", willOpen);
    menuToggle.classList.toggle("is-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Cerrar menú" : "Abrir menú");
    document.body.classList.toggle("menu-open", willOpen);
  });
  $$(".primary-nav a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
    if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      searchInput?.focus();
    }
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 760) closeMenu(); });

  // Filtros de catálogo
  searchInput?.addEventListener("input", renderInventory);
  brandFilter?.addEventListener("change", renderInventory);
  sortFilter?.addEventListener("change", renderInventory);
  categoryFilters?.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category || "";
    if (quickType) quickType.value = activeCategory;
    renderInventory();
    if (window.innerWidth < 761) $("#inventario")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $$(".category-card").forEach(button => button.addEventListener("click", () => {
    activeCategory = button.dataset.category || "";
    if (quickType) quickType.value = activeCategory;
    renderInventory();
    $("#inventario")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  $("#quickSearch")?.addEventListener("submit", event => {
    event.preventDefault();
    activeCategory = quickType?.value || "";
    if (brandFilter) brandFilter.value = quickBrand?.value || "";
    renderInventory();
    $("#inventario")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#clearFilters")?.addEventListener("click", clearFilters);
  $("#emptyReset")?.addEventListener("click", clearFilters);

  grid?.addEventListener("click", event => {
    const button = event.target.closest("[data-vehicle-id]");
    if (!button) return;
    const vehicle = vehicles.find(item => item.id === button.dataset.vehicleId);
    if (!vehicle) return;
    const message = `Hola, GAMA. Vi el vehículo de muestra ${vehicle.brand} ${vehicle.model} ${vehicle.version}, modelo ${vehicle.year}, en la página web. ¿Me pueden compartir información sobre el inventario disponible y el precio vigente?`;
    openWhatsApp(message);
  });

  // Formulario de oferta / consignación de vehículo
  const sellForm = $("#sellForm");
  const yearSelect = sellForm?.elements.namedItem("anio");
  if (yearSelect) {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 35; year--) yearSelect.add(new Option(String(year), String(year)));
  }
  sellForm?.addEventListener("submit", event => {
    event.preventDefault();
    if (!sellForm.reportValidity()) return;
    const data = new FormData(sellForm);
    const details = [
      "Hola, GAMA. Quiero ofrecer mi vehículo.",
      "",
      `Nombre: ${data.get("nombre")}`,
      `Mi WhatsApp: ${data.get("telefono")}`,
      `Vehículo: ${data.get("marca")} ${data.get("modelo")}`,
      `Año: ${data.get("anio")}`,
      `Kilometraje: ${data.get("kilometraje") || "No indicado"}`,
      `Modalidad: ${data.get("modalidad")}`,
      `Precio esperado: ${data.get("precio") || "Por conversar"}`,
      `Detalles: ${data.get("detalles") || "Sin detalles adicionales"}`
    ];
    openWhatsApp(details.join("\n"));
  });

  // Año del pie de página y mensaje de contacto general.
  const currentYear = $("#currentYear");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
  $$("a[href='#contacto']").forEach(link => {
    link.addEventListener("click", event => {
      // El enlace lleva a la sección de contacto en esta versión estática.
      // No se intercepta la navegación para preservar el comportamiento accesible.
      if (link.classList.contains("footer-contact-link")) {
        event.preventDefault();
        openWhatsApp("Hola, GAMA. Quisiera recibir información sobre compra, venta o consignación de vehículos.");
      }
    });
  });

  populateBrandOptions();
  renderInventory();
})();
