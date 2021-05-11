function signOut() {
  $.ajax({
    type: "POST",
    url: "/logout",
    success: (data) => {
      location.replace("/index.html");
    },
    error: (xhr) => {
      alert(JSON.stringify(xhr));
      location.replace("/index.html");
    },
  });
}
