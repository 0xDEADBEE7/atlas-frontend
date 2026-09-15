import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const sample = JSON.parse(readFileSync("../backend/sample.json", "utf8"));
const preparation = JSON.parse(readFileSync("../backend/prepare.json", "utf8"));

test.beforeEach(async ({ page }) => {
  await page.route("**/api/graphs/*", (route) =>
    route.fulfill({
      json: route.request().url().endsWith("/preparation")
        ? preparation
        : sample,
    }),
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Order fulfilment",
      level: 1,
      exact: true,
    }),
  ).toBeVisible();
});

test("editing, saving, navigation and deletion survive the component split", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.getByRole("button", { name: "Add activity" }).click();
  await expect(page.locator(".react-flow__node")).toHaveCount(4);
  await page.getByLabel("Name", { exact: true }).fill("Review order");
  await page.getByRole("button", { name: "Apply changes" }).click();
  const review = page
    .locator(".react-flow__node")
    .filter({ hasText: "Review order" });
  const bounds = await review.boundingBox();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + 20);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + 180, {
    steps: 12,
  });
  await page.mouse.up();
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  await page.getByRole("button", { name: "Process properties" }).click();
  await page.getByRole("button", { name: /Open subprocess/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Prepare order",
  );
  await page
    .getByRole("navigation", { name: "Breadcrumb" })
    .getByRole("button", { name: "Order fulfilment" })
    .click();
  await expect(page.locator(".react-flow__node")).toHaveCount(4);
  await page.reload();
  await expect(page.locator(".react-flow__node")).toHaveCount(4);
  await page
    .locator(".react-flow__node")
    .filter({ hasText: "Review order" })
    .click();
  await page.getByRole("button", { name: "Delete activity" }).click();
  await expect(page.locator(".react-flow__node")).toHaveCount(3);
  expect(errors).toEqual([]);
});

test("Tailwind preserves desktop and narrow-screen layout", async ({
  page,
}, testInfo) => {
  const canvas = page.getByRole("region", { name: "Process canvas" });
  const inspector = page.getByRole("complementary", {
    name: "Properties inspector",
  });
  await expect(canvas).toBeVisible();
  const desktopCanvas = await canvas.boundingBox();
  const desktopInspector = await inspector.boundingBox();
  expect(desktopInspector!.x).toBeGreaterThan(desktopCanvas!.x);
  expect(desktopCanvas!.height).toBeGreaterThan(400);
  await page.screenshot({
    path: testInfo.outputPath("desktop.png"),
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileCanvas = await canvas.boundingBox();
  const mobileInspector = await inspector.boundingBox();
  await page.screenshot({
    path: testInfo.outputPath("mobile.png"),
    fullPage: true,
  });
  expect(mobileCanvas!.height).toBe(480);
  expect(mobileInspector!.y).toBeGreaterThanOrEqual(
    mobileCanvas!.y + mobileCanvas!.height,
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});
