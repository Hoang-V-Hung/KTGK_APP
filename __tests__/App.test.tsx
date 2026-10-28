import React from 'react';
import {Pressable, Text} from 'react-native';
import ReactTestRenderer, {act} from 'react-test-renderer';
import App from '../App';
import {Button} from '../src/components/Button';
import {FormField} from '../src/components/FormField';

test('chuyển 3 tab và mở form thêm sân bằng Stack Navigation', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {renderer = ReactTestRenderer.create(<App />);});

  function hasText(text: string) {
    return renderer.root.findAllByType(Text).some(node => node.props.children === text);
  }
  async function changeTab(label: string) {
    await act(async () => {
      renderer.root.findAllByType(Pressable).find(node => node.props.accessibilityRole === 'tab' && node.props.accessibilityLabel === label)!.props.onPress();
    });
  }

  expect(hasText('Tổng quan')).toBe(true);
  await changeTab('Sân bóng');
  expect(hasText('Danh sách sân')).toBe(true);
  await changeTab('Lịch đặt');
  expect(hasText('Lịch đặt')).toBe(true);
  await changeTab('Tổng quan');
  expect(hasText('Sân đang hoạt động')).toBe(true);
  await changeTab('Sân bóng');
  await act(async () => {
    renderer.root.findAllByType(Button).find(button => button.props.title === '+ Thêm sân')!.props.onPress();
  });
  expect(renderer!.root.findAllByType(FormField).some(field => field.props.label === 'Tên sân')).toBe(true);
  await act(async () => renderer!.unmount());
}, 60000);
