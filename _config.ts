import lume from "lume/mod.ts";
import xeo from "xeo/mod.ts";
import basePath from "lume/plugins/base_path.ts";

const BASE_URL = Deno.env.get("BASE_URL") || "http://localhost:8000/";

const site = lume({
  location: new URL(BASE_URL),
});

// 1. Copy the audio file
site.copy("assets/audio/Single_Frog_Croak1.ogg");

// 2. Use process (not preprocess) to inject after the layout is rendered
site.process([".html"], (pages) => {
  for (const page of pages) {
    const content = page.content as string;
    
    if (!content.includes("</body>")) continue;

    const injection = `
      <audio id="click-sound" preload="auto">
        <source src="${site.url("/assets/audio/Single_Frog_Croak1.ogg")}" type="audio/ogg">
      </audio>
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          const audio = document.getElementById('click-sound');
          const logo = document.querySelector('a.navbar-home');
          
          if (logo && audio) {
            logo.addEventListener('click', (e) => {
              e.preventDefault(); 
              audio.currentTime = 0;
              audio.play();
              
              // Navigate after a short delay so sound starts
              setTimeout(() => window.location.href = logo.href, 520);
            });
          }
        });
      </script>
    </body>`;

    page.content = content.replace(/<\/body>/i, injection);
  }
});
site.use(basePath());
site.use(xeo());

export default site;