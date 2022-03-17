export const moveScrollToTop = () => {
  const divRef = document.querySelector("#back-to-top-anchor");

  if (divRef) {
    divRef.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};
