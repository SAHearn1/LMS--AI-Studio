import { NextRequest, NextResponse } from "next/server";

type Deployment = {
  id: string;
  name: string;
  status: "pending" | "active" | "failed";
  createdAt: string;
};

const deployments: Record<string, Deployment> = {
  "1": {
    id: "1",
    name: "Initial Deployment",
    status: "active",
    createdAt: new Date("2024-01-10T12:00:00Z").toISOString(),
  },
  "2": {
    id: "2",
    name: "Feature Rollout",
    status: "pending",
    createdAt: new Date("2024-02-01T09:30:00Z").toISOString(),
  },
};

export const dynamic = "force-static";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deployment = deployments[params.id];

  if (!deployment) {
    return NextResponse.json({ message: "Deployment not found" }, { status: 404 });
  }

  return NextResponse.json(deployment);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const payload = (await request.json()) as Partial<Deployment>;
  const existingDeployment = deployments[params.id];

  if (!existingDeployment) {
    return NextResponse.json({ message: "Deployment not found" }, { status: 404 });
  }

  deployments[params.id] = {
    ...existingDeployment,
    ...payload,
    id: existingDeployment.id,
  };

  return NextResponse.json(deployments[params.id]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const existingDeployment = deployments[params.id];

  if (!existingDeployment) {
    return NextResponse.json({ message: "Deployment not found" }, { status: 404 });
  }

  delete deployments[params.id];

  return NextResponse.json({ message: "Deployment removed" });
}
