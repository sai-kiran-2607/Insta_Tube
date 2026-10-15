/**
 * Expo Config Plugin for Android Native ACTION_SEND Share Sheet Integration
 *
 * This plugin injects the necessary <intent-filter> into AndroidManifest.xml
 * so ReelFetch appears as a target in the Android system share sheet
 * when users share text/URLs from Instagram.
 */

const { withAndroidManifest } = require('expo/config-plugins');

function withAndroidShareIntent(config) {
  return withAndroidManifest(config, (manifestConfig) => {
    const mainApplication = manifestConfig.modResults.manifest.application?.[0];
    if (!mainApplication) return manifestConfig;

    const mainActivity = mainApplication.activity?.find(
      (a) => a.$?.['android:name'] === '.MainActivity'
    );

    if (!mainActivity) return manifestConfig;

    // Ensure intent-filter array exists
    mainActivity['intent-filter'] = mainActivity['intent-filter'] || [];

    // Check if ACTION_SEND filter is already declared
    const hasSendIntent = mainActivity['intent-filter'].some((filter) => {
      return filter.action?.some(
        (action) => action.$?.['android:name'] === 'android.intent.action.SEND'
      );
    });

    if (!hasSendIntent) {
      mainActivity['intent-filter'].push({
        action: [{ $: { 'android:name': 'android.intent.action.SEND' } }],
        category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
        data: [{ $: { 'android:mimeType': 'text/plain' } }],
      });
    }

    return manifestConfig;
  });
}

module.exports = withAndroidShareIntent;
