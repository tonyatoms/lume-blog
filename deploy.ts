import { copy } from "https://deno.land/std@0.208.0/fs/copy.ts";
import { join } from "https://deno.land/std@0.208.0/path/join.ts";

const REPO_ROOT = "/Users/tonyadams/Documents/projects/atoms2/atoms.net";
const TARGET_DIR = "/Users/tonyadams/Documents/projects/atoms2/atoms.net/public/blog";
const SOURCE_DIR = "_site";
const COMMIT_MESSAGE = "chore: Automated Lume blog update";

// Helper function to execute shell commands
async function runCommand(command: string, args: string[], cwd: string) {
  console.log(`\n$ Running: ${command} ${args.join(' ')} in ${cwd}`);
  const cmd = new Deno.Command(command, {
    args: args,
    cwd: cwd,
    stdout: "inherit",
    stderr: "inherit",
  });
  const { code } = await cmd.output();
  if (code !== 0) {
    throw new Error(`Command failed: ${command}`);
  }
}

async function deploy() {
  console.log("--- 1. Building Lume site ---");
  await runCommand("deno", ["task", "build"], Deno.cwd());

  console.log(`--- 2. Copying contents of ${SOURCE_DIR} to ${TARGET_DIR} ---`);
  
  // ⚠️ IMPORTANT: We remove the old folder first to ensure no stale files remain.
  try {
    await Deno.remove(TARGET_DIR, { recursive: true });
  } catch (error) {
    // Ignore if the directory doesn't exist yet
    if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
    }
  }
  // Use Deno's copy utility to copy the whole directory recursively
  await copy(SOURCE_DIR, TARGET_DIR, { overwrite: true });
  
  // The git commands must run from the destination repository's root
  const GIT_CWD = REPO_ROOT;

  console.log("--- 3. Committing and Pushing changes in atoms.net repository ---");
  
  // 3a. Add the new/revised files to the commit stage
  await runCommand("git", ["add", "public/blog"], GIT_CWD);
  
  // 3b. Commit the changes
  await runCommand("git", ["commit", "-m", COMMIT_MESSAGE], GIT_CWD);

  // 🚨 Pull with the --rebase flag to ensure a clean, linear merge
  console.log("--- Pulling remote changes using rebase strategy ---");
  await runCommand("git", ["pull", "--rebase", "origin", "main"], GIT_CWD);

  // 3c. Push to the remote repository
  await runCommand("git", ["push", "origin", "main"], GIT_CWD); 

  console.log("\n✅ Deployment successful!");
}

deploy().catch(err => {
  console.error("\n❌ Deployment failed:", err.message);
  Deno.exit(1);
});