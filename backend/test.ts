import { getWorkspaceAnalytics } from './src/services/analyticsService';
import prisma from './src/lib/prisma';

async function test() {
  const workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    console.log("No workspace found");
    process.exit(0);
  }
  
  console.log("Testing workspace:", workspace.id);
  try {
    const data = await getWorkspaceAnalytics(workspace.id, '30d');
    console.log("SUCCESS, data size:", JSON.stringify(data).length);
  } catch (err) {
    console.error("ERROR:", err);
  }
  process.exit(0);
}

test();
