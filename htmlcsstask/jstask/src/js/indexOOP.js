class TransactionsManager {
  constructor() {
    this.btn = document.querySelector(".btn");
    this.searchInput = document.querySelector(".transactions__search-box");
    this.lists = document.querySelector(".transactions__lists");
    this.listsContainer = document.querySelector(".transactions__table");
    this.caretIcon = document.querySelectorAll(".caret-icon");
    this.sortOrder = "";
    this.searchItem = "";
    this.sortBy = "";
    this.allProductsData = [];
    this.initListeners();
  }

  initListeners() {
    this.btn.addEventListener("click", this.httpRequestHandler.bind(this));
    this.searchInput.addEventListener("input", (e) => {
      this.searchItem = e.target.value;
      this.httpRequestHandler();
    });
    this.caretIcon.forEach((icon) =>
      icon.addEventListener("click", (e) => {
        e.target.classList.toggle("rotate-up");
        this.sortBy = e.target.dataset.type;
        this.sortOrder = e.target.classList.contains("rotate-up")
          ? "desc"
          : "asc";
        this.httpRequestHandler();
      })
    );
  }

  httpRequestHandler() {
    axios
      .get(
        this.sortBy && this.sortOrder
          ? `http://localhost:3000/transactions?_sort=${this.sortBy}&_order=${this.sortOrder}&refId_like=${this.searchItem} `
          : `http://localhost:3000/transactions?refId_like=${this.searchItem}`
      )
      .then((res) => {
        this.allProductsData = res.data;
        this.renderProducts(res.data);
      })
      .catch((err) => console.log(err));
  }

  renderProducts(data) {
    this.btn.classList.add("hidden");
    this.searchInput.classList.remove("hidden");
    this.listsContainer.classList.remove("hidden");
    this.lists.innerHTML = data
      .map(
        (item) =>
          `<tr>
          <td>${item.id}</td>
          <td class="${
            item.type === "برداشت از حساب" ? "color-red" : "color-green"
          }">${item.type}</td>
          <td>${item.price}</td>
          <td>${item.refId}</td>
          <td>${new Date(item.date).toLocaleDateString("fa-IR")}</td>
        </tr>`
      )
      .join("\n");
  }
}

new TransactionsManager();
