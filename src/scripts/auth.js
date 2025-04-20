export const handleLogin = async (event) => {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageElement = document.getElementById("message");

    console.log("Intentando login con:", email, password);
  
    try {
        const response = await fetch("http://localhost/cremas_y_mil_hojas_Backend/public/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        console.log("Estado de la respuesta:", response.status);

        const data = await response.json();
        console.log("Respuesta del servidor:", data);

        if (data.success) {
            messageElement.textContent = "Inicio de sesión exitoso";
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } else {
            messageElement.textContent = data.error || "Error desconocido";
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        messageElement.textContent = "Error en el servidor";
    }
};
