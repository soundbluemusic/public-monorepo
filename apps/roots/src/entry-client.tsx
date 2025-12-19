/**
 * @fileoverview 클라이언트 엔트리 포인트
 *
 * 브라우저에서 앱을 마운트하는 진입점입니다.
 * SolidStart의 StartClient를 사용하여 SSG로 생성된
 * HTML에 클라이언트 사이드 인터랙티브 기능을 추가합니다.
 *
 * @refresh reload - HMR 시 전체 새로고침 활성화
 */
import { StartClient, mount } from '@solidjs/start/client';

const appElement = document.getElementById('app');
if (appElement) {
  mount(() => <StartClient />, appElement);
}
