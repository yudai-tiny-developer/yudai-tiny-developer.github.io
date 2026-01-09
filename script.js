const cards = document.querySelectorAll(".extension-card");
const modal = document.getElementById("modal");

const mImg = document.getElementById("modal-img");
const mTitle = document.getElementById("modal-title");
const mDesc = document.getElementById("modal-desc");
const mStore = document.getElementById("modal-store");
const mGit = document.getElementById("modal-github");

const imgContainer = document.getElementById("modal-images");

cards.forEach(card => {
  card.addEventListener("click", async () => {

    mTitle.textContent = card.dataset.title;
    mStore.href = card.dataset.store;
    mGit.href = card.dataset.github;

    imgContainer.innerHTML = "";
    const imgs = card.dataset.img.split(",").map(s => s.trim());

    imgs.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.loading = "lazy";
      imgContainer.appendChild(img);
    });

    try {
      const res = await fetch(card.dataset.descFile);
      const text = await res.text();
      mDesc.textContent = text;
    } catch {
      mDesc.textContent = "";
    }

    modal.classList.remove("hidden");
  });
});


modal.querySelector(".modal-overlay").onclick =
  modal.querySelector(".modal-close").onclick = () => {
    modal.classList.add("hidden");
  };
