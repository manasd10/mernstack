export function showToast(msg, ms = 3000) {
  try {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    el.style.opacity = "1";
    document.body.appendChild(el);
    setTimeout(() => { el.style.transition = "opacity .4s"; el.style.opacity = "0"; setTimeout(()=>el.remove(), 450); }, ms);
  } catch { console.log(msg); }
}
