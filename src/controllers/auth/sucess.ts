import { Request, Response } from "express";
import { ENVIRONMENT } from "../../common/config/environment";

export const success = async (req: Request, res: Response): Promise<void> => {
  const loginUrl = ENVIRONMENT.CLIENT.URL + "/auth/login";
  const redirectDelay = 1;

  // Ensure loginUrl is defined
  if (!loginUrl) {
    res.status(500).send("Login URL is not defined.");
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="refresh" content="${redirectDelay}; url=${loginUrl}">
        <title>Email Verification Success</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f0f0f0;
            }
            .container {
                text-align: center;
                background-color: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .button {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                transition: background-color 0.3s;
            }
            .button:hover {
                background-color: #45a049;
            }
            .countdown {
                margin-top: 15px;
                color: #666;
                font-size: 0.9em;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .fade-in {
                animation: fadeIn 0.5s ease-in;
            }
        </style>
        <script>
            window.onload = function() {
                let timeLeft = ${redirectDelay};
                const countdownElement = document.getElementById('countdown');
                
                const updateCountdown = setInterval(() => {
                    if (timeLeft > 0) {
                        countdownElement.textContent = \`Redirecting to login page in \${timeLeft} second\${timeLeft === 1 ? '' : 's'}...\`;
                        timeLeft--;
                    } else {
                        clearInterval(updateCountdown);
                        window.location.href = "${loginUrl}";
                    }
                }, 1000);
            };
        </script>
    </head>
    <body>
        <div class="container fade-in" role="alert">
            <h1>Email Verified Successfully! ✅</h1>
            <p>Your email has been verified successfully.</p>
            <div id="countdown" class="countdown" aria-live="polite">
                Redirecting to login page in ${redirectDelay} seconds...
            </div>
            <p>Click the button below if you don't want to wait:</p>
            <a href="${loginUrl}" class="button">Go to Login</a>
        </div>
    </body>
    </html>
  `;

  res.send(html);
};
