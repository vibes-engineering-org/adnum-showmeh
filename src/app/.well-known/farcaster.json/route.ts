import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl =
    process.env.NEXT_PUBLIC_URL ||
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: "{\"accountAssociation\":{\"header\":\"eyJmaWQiOjIwMDM3NSwidHlwZSI6ImF1dGgiLCJrZXkiOiIweENEZDlEMDZlMjQyRjUyOTA4NTg5YjJkMjU2MTQzMjllMTU0MTY2RTUifQ\",\"payload\":\"eyJkb21haW4iOiJhZG51bS1zaG93bWVoLnZlcmNlbC5hcHAifQ\",\"signature\":\"63EGtUldRWBJld+qCOPQAIz3y6Ex9ZBCK+kBJ6Hz+okwCpxY3OfBCGtPlIHBMx3+yVK4z+WkGuKA/wNnfWXQ+Rs=\"},\"miniapp\":{\"version\":\"1\",\"name\":\"showmeh\",\"iconUrl\":\"https://adnum-showmeh.vercel.app/icon.png\",\"homeUrl\":\"https://adnum-showmeh.vercel.app\"}}",
    miniapp: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      ogImageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Open",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
      primaryCategory: "social",
    },
  };

  return Response.json(config);
}
