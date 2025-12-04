import lume from "lume/mod.ts";
import xeo from "xeo/mod.ts";
import basePath from "lume/plugins/base_path.ts";

const BASE_URL = Deno.env.get("BASE_URL") || "http://localhost:8000/";

const site = lume({
  // Use the dynamic BASE_URL
  location: new URL(BASE_URL),
});
site.use(basePath());
site.use(xeo());

export default site;
