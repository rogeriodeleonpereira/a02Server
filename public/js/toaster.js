function createToastContainer() {
  // Check if the container already exists
  if (!document.getElementById("toast-container")) {
      const containerHtml = '<ul id="toast-container" style="position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); list-style: none; padding: 0; margin: 0; z-index: 1000;"></ul>';
      document.body.insertAdjacentHTML('beforeend', containerHtml);
  }
}

function injectStyles() {
  const styles = `
      .toast-message {
          visibility: hidden;
          min-width: 250px;
          margin-bottom: 10px;
          background-color: #333;
          color: #fff;
          text-align: center;
          border-radius: 15px;
          padding: 16px;
          font-size: 17px;
          list-style: none;
      }
      .toast-message.add, .toast-message.remove, .toast-message.update {
        visibility: visible;
      }
      .toast-message.add {
        background-color: green;
      }      
      .toast-message.remove {
        background-color: red;
      }       
      .toast-message.update {
        background-color: blue;
      }       
      .toast-progress {
        width: 0%;
        height: 5px;
        background-color: #fff;
        border-radius: 0 0 15px 15px; /* Rounded corners at the bottom */
        transition: width 2.5s linear; /* Placeholder transition, will be overridden */
      }      
      @keyframes fadein {
          from {opacity: 0; transform: translateY(20px);}
          to {opacity: 1; transform: translateY(0);}
      }
      @keyframes fadeout {
          from {opacity: 1;}
          to {opacity: 0; transform: translateY(-20px);}
      }`;
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

const toaster = (() => {
  createToastContainer();
  injectStyles();

  function showToast(type, msg, delay = 3000) {
      const container = document.getElementById("toast-container");
      const toast = document.createElement('li');
      toast.className = `toast-message ${type}`;
      toast.innerHTML = `<p>${msg}</p>`;
      toast.style.animation = "fadein 0.5s forwards"; 
      // Create the progress bar element
      const progressBar = document.createElement('div');
      progressBar.className = 'toast-progress';
      progressBar.style.transition = `width ${delay - 500}ms linear`;
       // Append the progress bar to the toast
      toast.appendChild(progressBar);
      container.appendChild(toast);
      // Start filling the progress bar shortly after toast appears
      setTimeout(() => progressBar.style.width = '100%', 50); 
      setTimeout(() => {
          toast.style.animation = 'fadeout 0.5s forwards';
          toast.addEventListener('animationend', () => toast.remove());
      }, delay - 500);
  }

  return {
      show: showToast
  };
})();

export { toaster };
