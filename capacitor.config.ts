import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nemoneai.matmatch',
  appName: '네모네AIM',
  webDir: 'public', // 라이브 웹사이트를 직접 띄우기 위해 빈 껍데기 폴더로 지정합니다.
  server: {
    url: 'https://nemoneai.com', // 라이브 서버 연동
    cleartext: true
  }
};

export default config;
