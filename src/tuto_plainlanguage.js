console.log("oui");

// --- Accordéon principal (déjà présent) ---
document.querySelectorAll(".accordion-header").forEach(header => {
  header.addEventListener("click", () => {
    const body = header.nextElementSibling;

    // Toggle visibility
    body.style.display = body.style.display === "block" ? "none" : "block";

    // Optionally close others (accordion behavior)
    document.querySelectorAll(".accordion-body").forEach(other => {
      if (other !== body) other.style.display = "none";
    });
  });
});

// --- Navigation boutons (déjà présent) ---
document.querySelector(".icon-bell").addEventListener("click", () => {
  window.location.href = "../notification_reminder.html";
});

document.getElementById("badges-btn").addEventListener("click", () => {
  window.location.href = "../badges_menu.html";
});

document.getElementById("home-btn").addEventListener("click", () => {
  window.location.href = "../main-menu.html";
});

// === AJOUT : Gestion des onglets principaux et sous-onglets ===
document.addEventListener("DOMContentLoaded", () => {
  // Gestion des onglets principaux
  document.querySelectorAll('.tab-buttons button').forEach(button => {
    button.addEventListener('click', (event) => {
      const id = button.getAttribute('data-tab-target');
      // Masquer tous les contenus
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
      });
      // Retirer la classe active de tous les boutons onglets
      document.querySelectorAll('.tab-buttons button').forEach(btn => {
        btn.classList.remove('active');
      });

      // Afficher le contenu sélectionné
      document.getElementById(id).style.display = 'block';
      button.classList.add('active');

      // Réinitialiser les sous-onglets affichés
      const container = document.getElementById(id);
      container.querySelectorAll('.inner-content').forEach(content => {
        content.style.display = 'none';
      });
      container.querySelectorAll('.inner-tabs button').forEach(btn => {
        btn.classList.remove('active');
      });
    });
  });

  // Gestion des sous-onglets internes
  document.querySelectorAll('.inner-tabs button').forEach(button => {
    button.addEventListener('click', (event) => {
      const id = button.getAttribute('data-inner-tab-target');
      const container = button.closest('.tab-content');

      container.querySelectorAll('.inner-content').forEach(inner => {
        inner.style.display = 'none';
      });
      container.querySelectorAll('.inner-tabs button').forEach(btn => {
        btn.classList.remove('active');
      });

      document.getElementById(id).style.display = 'block';
      button.classList.add('active');
    });
  });

  // Optionnel : ouvrir le premier onglet principal automatiquement
  const firstTabBtn = document.querySelector('.tab-buttons button');
  if (firstTabBtn) firstTabBtn.click();
});
