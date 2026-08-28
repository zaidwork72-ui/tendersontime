const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const icon = item.querySelector(".faq-icon");

    if (!question || !icon) return;

    question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        faqItems.forEach(otherItem => {
            otherItem.classList.remove("active");
            const otherIcon = otherItem.querySelector(".faq-icon");
            if (otherIcon) otherIcon.textContent = "expand_more";
        });

        if (!isActive) {
            item.classList.add("active");
            icon.textContent = "expand_less";
        }
    });
});

document.querySelectorAll(".favourite span").forEach(icon => {
    icon.addEventListener("click", function () {
        this.classList.toggle("active");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".market-tabs .tab");
    const panels = document.querySelectorAll(".market-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const target = tab.dataset.target;
            panels.forEach(panel => {
                panel.style.display = panel.dataset.panel === target ? "" : "none";
            });
        });
    });

    const customSelect = document.querySelector(".custom-select");
    if (customSelect) {
        const selectedOption = customSelect.querySelector(".selected-option");
        const selectedText = selectedOption ? selectedOption.querySelector("span") : null;
        const options = customSelect.querySelectorAll(".custom-option");
        const hiddenInput = customSelect.querySelector("input[type='hidden']");

        if (selectedOption && selectedText) {
            selectedOption.addEventListener("click", (event) => {
                event.preventDefault();
                const isOpen = customSelect.classList.toggle("active");
                selectedOption.setAttribute("aria-expanded", isOpen ? "true" : "false");
            });

            options.forEach(option => {
                option.addEventListener("click", () => {
                    selectedText.textContent = option.textContent.trim();
                    options.forEach(item => item.classList.remove("active"));
                    option.classList.add("active");
                    if (hiddenInput) hiddenInput.value = option.dataset.value || "";
                    customSelect.classList.remove("active");
                    selectedOption.setAttribute("aria-expanded", "false");
                });
            });

            document.addEventListener("click", (event) => {
                if (!customSelect.contains(event.target)) {
                    customSelect.classList.remove("active");
                    selectedOption.setAttribute("aria-expanded", "false");
                }
            });
        }
    }

    const prevBtn = document.getElementById("testimonial-prev");
    const nextBtn = document.getElementById("testimonial-next");
    const track = document.querySelector(".rightAlign-track");
    const reviewSet = document.querySelector(".review-set:not(.copy)");

    if (!track || !prevBtn || !nextBtn || !reviewSet) return;

    const mq = window.matchMedia("(min-width: 769px)");
    const cards = Array.from(reviewSet.querySelectorAll(".review"));
    const visibleCards = 2;

    if (!cards.length) return;

    let currentIndex = 0;
    const maxIndex = Math.max(cards.length - visibleCards, 0);

    const updateDesktopSlider = () => {
        if (!mq.matches) {
            track.style.transition = "none";
            track.style.transform = "";
            return;
        }

        const firstCard = cards[0];
        const gap = parseFloat(window.getComputedStyle(track).gap || "0");
        const step = firstCard.getBoundingClientRect().width + gap;

        track.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
        track.style.transform = `translateX(-${currentIndex * step}px)`;
    };

    nextBtn.addEventListener("click", () => {
        if (!mq.matches) return;
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateDesktopSlider();
    });

    prevBtn.addEventListener("click", () => {
        if (!mq.matches) return;
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        updateDesktopSlider();
    });

    [prevBtn, nextBtn].forEach((button) => {
        button.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                button.click();
            }
        });
    });

    window.addEventListener("resize", updateDesktopSlider);
    mq.addEventListener("change", () => {
        currentIndex = 0;
        updateDesktopSlider();
    });
    updateDesktopSlider();
});
