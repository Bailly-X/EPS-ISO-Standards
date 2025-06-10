const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("gameId");
const round = urlParams.get("round") || 1;

document.getElementById("beginBtn").onclick = function() {
  window.location.href = `./play-round.html?gameId=${gameId}&round=${round}`;
};


document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', function(e) {
    document.querySelectorAll('.item').forEach(i => {
      if (i !== item) i.classList.remove('open');
    });
    item.classList.toggle('open');
  });
});