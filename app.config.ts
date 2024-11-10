import { ExpoConfig, ConfigContext } from "expo/config";

enum AppEnv {
  production = "production",
  preview = "preview",
  development = "development",
}

export default ({ config: baseConfig }: ConfigContext): ExpoConfig => {
  const EXPO_PUBLIC_APP_ENV: AppEnv | null | undefined = process.env.EXPO_PUBLIC_APP_ENV
    ? process.env.EXPO_PUBLIC_APP_ENV.toLowerCase() as AppEnv
    : AppEnv.production;
  const isProduction = EXPO_PUBLIC_APP_ENV === AppEnv.production;

  const baseAppIdentifier = "com.thalida.com.shapeconnector";
  const appIdentifier = isProduction
    ? baseAppIdentifier
    : `${baseAppIdentifier}.${EXPO_PUBLIC_APP_ENV}`;

  const colors = {
    [AppEnv.production]: "#4939FF",
    [AppEnv.preview]: "#009087",
    [AppEnv.development]: "#C99100",
  };

  const envAssetsPath = `./src/assets/app/${EXPO_PUBLIC_APP_ENV}`;

  const dynamicConfig: Partial<ExpoConfig> = {
    name: isProduction ? (baseConfig.name as string) : `${baseConfig.name} (${EXPO_PUBLIC_APP_ENV})`,
    scheme: isProduction ? (baseConfig.scheme as string) : `${baseConfig.scheme}${EXPO_PUBLIC_APP_ENV}`,
    icon: `${envAssetsPath}/icon.png`,
    splash: {
      ...baseConfig.splash,
      image: `${envAssetsPath}/splash.png`,
      resizeMode: "contain",
      backgroundColor: colors[EXPO_PUBLIC_APP_ENV],
    },
    ios: {
      ...baseConfig.ios,
      bundleIdentifier: appIdentifier,
    },
    android: {
      ...baseConfig.android,
      package: appIdentifier,
      adaptiveIcon: {
        foregroundImage: `${envAssetsPath}/adaptive-icon.png`,
        backgroundColor: colors[EXPO_PUBLIC_APP_ENV],
      },
      // googleServicesFile:
      //   process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
    },
    web: {
      ...baseConfig.web,
      favicon: `${envAssetsPath}/favicon.png`,
    },
  };

  return {
    ...baseConfig,
    ...dynamicConfig,
  } as ExpoConfig;
};
