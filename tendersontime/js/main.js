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

    const initManualSlider = ({
        trackSelector,
        prevSelector,
        nextSelector,
        itemSelector,
        getVisibleItems,
        resetOnResize = true
    }) => {
        const prevBtn = document.querySelector(prevSelector);
        const nextBtn = document.querySelector(nextSelector);
        const track = document.querySelector(trackSelector);
        const firstSet = track ? track.querySelector(itemSelector) : null;

        if (!track || !prevBtn || !nextBtn || !firstSet) return;

        const cards = Array.from(firstSet.querySelectorAll(".review, .card"));
        if (!cards.length) return;

        let currentIndex = 0;

        const getMaxIndex = () => {
            const visibleItems = getVisibleItems();
            return Math.max(cards.length - visibleItems, 0);
        };

        const updateSlider = () => {
            const firstCard = cards[0];
            const gap = parseFloat(window.getComputedStyle(track).gap || "0");
            const step = firstCard.getBoundingClientRect().width + gap;
            const maxIndex = getMaxIndex();
            currentIndex = Math.min(currentIndex, maxIndex);

            track.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
            track.style.transform = `translateX(-${currentIndex * step}px)`;
        };

        nextBtn.addEventListener("click", () => {
            const maxIndex = getMaxIndex();
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            updateSlider();
        });

        prevBtn.addEventListener("click", () => {
            const maxIndex = getMaxIndex();
            currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
            updateSlider();
        });

        [prevBtn, nextBtn].forEach((button) => {
            button.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    button.click();
                }
            });
        });

        if (resetOnResize) {
            window.addEventListener("resize", () => {
                currentIndex = 0;
                updateSlider();
            });
        }

        updateSlider();
    };

    initManualSlider({
        trackSelector: ".rightAlign-track",
        prevSelector: "#testimonial-prev",
        nextSelector: "#testimonial-next",
        itemSelector: ".review-set:not(.copy)",
        getVisibleItems: () => (window.innerWidth <= 768 ? 1 : 2)
    });

    initManualSlider({
        trackSelector: ".lower-track",
        prevSelector: "#why-prev",
        nextSelector: "#why-next",
        itemSelector: ".lower-set:not(.copy)",
        getVisibleItems: () => (window.innerWidth <= 768 ? 1 : 2)
    });
});







// latest-tenders-dropdown2 
// dropdown-filters.js
document.querySelectorAll('[data-dropdown]').forEach(function (dropdown) {
    const toggle = dropdown.querySelector('.df-toggle');
    const label = dropdown.querySelector('.df-toggle-label');
    const menu = dropdown.querySelector('.df-menu');
    const options = dropdown.querySelectorAll('.df-option');
    const hiddenInput = dropdown.querySelector('.df-value');

    function closeDropdown() {
        dropdown.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    function openDropdown() {
        // close any other open dropdowns first
        document.querySelectorAll('[data-dropdown].is-open').forEach(function (open) {
            if (open !== dropdown) {
                open.classList.remove('is-open');
                open.querySelector('.df-toggle').setAttribute('aria-expanded', 'false');
            }
        });
        dropdown.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (dropdown.classList.contains('is-open')) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    options.forEach(function (option) {
        option.addEventListener('click', function () {
            options.forEach(function (o) { o.classList.remove('is-active'); });
            option.classList.add('is-active');
            label.textContent = option.textContent.trim();
            if (hiddenInput) hiddenInput.value = option.getAttribute('data-value');
            dropdown.classList.remove('has-error');
            closeDropdown();
        });
    });

    // close when clicking outside
    document.addEventListener('click', function (e) {
        if (!dropdown.contains(e.target)) {
            closeDropdown();
        }
    });

    // close on escape
    dropdown.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDropdown();
    });
});