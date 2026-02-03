const cards = document.querySelectorAll(".extension-card");
const modal = document.getElementById("modal");

const mImg = document.getElementById("modal-img");
const mTitle = document.getElementById("modal-title");
const mDesc = document.getElementById("modal-desc");
const mChromeStore = document.getElementById("modal-chrome-store");
const mFirefoxAddons = document.getElementById("modal-firefox-addons");
const mGit = document.getElementById("modal-github");

const imgContainer = document.getElementById("modal-images");

cards.forEach(card => {
  card.dataset.img.split(",").forEach(src => {
    const img = new Image();
    img.src = src.trim();
  });

  card.addEventListener("click", async () => {
    mTitle.textContent = card.dataset.title;
    mChromeStore.href = card.dataset.chromeStore;
    mFirefoxAddons.href = card.dataset.firefoxAddons;
    mGit.href = card.dataset.github;

    imgContainer.innerHTML = "";
    const imgs = card.dataset.img.split(",").map(s => s.trim());

    const fragment = document.createDocumentFragment();

    imgs.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.decoding = "async";
      fragment.appendChild(img);
    });

    imgContainer.replaceChildren(fragment);

    mDesc.textContent = card.dataset.desc.replaceAll("\\n", "\n");

    modal.classList.remove("hidden");
  });
});

modal.querySelector(".modal-overlay").onclick =
  modal.querySelector(".modal-close").onclick = () => {
    modal.classList.add("hidden");
  };
