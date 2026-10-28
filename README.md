# Quản lý sân bóng mini — Đề 2

Ứng dụng React Native CLI + TypeScript, triển khai theo `De2_QuanLySanBong.docx`. Project có sẵn mang tên `FootballFieldAp`, không dùng Expo hay thư viện UI dựng sẵn.

## Chạy Android

Yêu cầu Node >= 22.11, JDK 17 trở lên tương thích Gradle, Android SDK và máy ảo hoặc điện thoại đã bật USB debugging.

```powershell
cd E:\TKGDND\FootballFieldAp
npm ci
npm start
```

Mở terminal thứ hai trong project:

```powershell
npx react-native run-android
```

Nếu `java -version` hiện Java 8, đặt JDK cho terminal hiện tại. Ví dụ trên máy đang làm bài:

```powershell
$env:JAVA_HOME = 'C:\Users\Lenovo\.jdks\ms-17.0.16'
$env:ANDROID_HOME = 'C:\Users\Lenovo\AppData\Local\Android\Sdk'
npx react-native run-android
```

Trên máy khác, thay đường dẫn theo JDK và SDK thực tế. Có thể tạo `android/local.properties` với `sdk.dir` tương ứng thay cho biến `ANDROID_HOME`.

## Chạy iOS trên macOS

```sh
npm ci
bundle install
cd ios
bundle exec pod install
cd ..
npm start
# Terminal khác:
npx react-native run-ios
```

## Đối chiếu yêu cầu

| Câu | Phần triển khai |
| --- | --- |
| 1 | FlatList hiển thị tên, loại, giá theo VNĐ, nhãn xanh/cam và số sân hoạt động/tổng số sân. |
| 2 | Stack Navigation; dùng chung form thêm/sửa, điền sẵn thông tin khi sửa; nút chọn loại/trạng thái; lỗi ngay dưới ô. Tên được kiểm tra trùng không phân biệt chữ hoa và khoảng trắng hai đầu. |
| 3 | Nút xoá ở từng thẻ; Alert xác nhận; chặn sân còn bất kỳ lượt đặt nào. |
| 4 | Chi tiết sân và FlatList các lượt đặt; Modal nhập đặt sân; tính tiền ngay khi nhập số giờ; khoá nút đặt khi bảo trì. |
| 5 | Kiểm tra SĐT, ngày thực theo dd/mm/yyyy, giờ nguyên 6–22, thuê 1–3 giờ, kết thúc không quá 23h; chặn giao nhau cùng sân/ngày; huỷ lịch có Alert. |
| 6 | Lưu đồng thời sân và lịch đặt trong một bản dữ liệu AsyncStorage. Chỉ tạo 4 sân và 3 lịch mẫu khi chưa có dữ liệu; danh sách rỗng không bị tạo lại mẫu. |
| 7 | Theme dùng chung, StyleSheet.create, thẻ bo góc có bóng, hiệu ứng nhấn, nút khoá, danh sách rỗng, viền đỏ cho lỗi, SafeAreaView và KeyboardAvoidingView/ScrollView. |

Dữ liệu mẫu gồm Sân A1, A2, B1 hoạt động và B2 bảo trì. Ba lượt mẫu lấy ngày chạy ứng dụng lần đầu. Sân A1 có lịch 17:00–19:00 và 20:00–21:00; Sân B1 có lịch 18:00–20:00. Tên và số điện thoại khách trong mẫu chỉ là dữ liệu minh hoạ.

Quy tắc trùng giờ: `newStart < oldEnd && oldStart < newEnd`. Ví dụ 18h–20h trùng với 17h–19h; 19h–20h được phép. Kiểm tra lại quy tắc ngay trước khi ghi dữ liệu để tránh lưu lịch không hợp lệ. Nếu lỗi lưu, dữ liệu đang hiển thị vẫn giữ nguyên và có Alert báo lỗi. Nếu lỗi đọc, ứng dụng cho tải lại và không ghi đè dữ liệu cũ.

## Cấu trúc mã

- `src/screens`: danh sách, form thêm/sửa, chi tiết sân.
- `src/components`: nút, ô nhập, lựa chọn, nhãn trạng thái, thẻ sân/lịch và Modal đặt sân.
- `src/contexts/AppContext.tsx`: cung cấp dữ liệu dùng chung và hiển thị trạng thái tải/lỗi.
- `src/hooks/useAppData.ts`: quản lý state, đọc/lưu AsyncStorage và nghiệp vụ thêm/sửa/xoá sân, đặt/huỷ lịch.
- `src/hooks/useApp.ts`: truy cập Context an toàn.
- `src/hooks/useValidatedForm.ts`: quản lý dữ liệu nhập, trạng thái đã chạm ô và lỗi của form.
- `src/hooks/useFieldForm.ts`, `useBookingForm.ts`: xử lý form sân, form đặt lịch, tính tiền và lưu dữ liệu.
- `src/services/storage.ts`: khởi tạo, kiểm tra và lưu/đọc AsyncStorage.
- `src/utils/validation.ts`: kiểm tra sân, ngày, số điện thoại và trùng lịch.
- `src/theme/colors.ts`: màu sắc, cỡ chữ và bố cục dùng chung.
- `__tests__`: kiểm thử dữ liệu nhập, ca biên trùng lịch, lưu trữ và thao tác nghiệp vụ.

## Kiểm tra

```sh
npx tsc --noEmit
npm run lint
npm test -- --runInBand
```

Android dùng Kotlin Gradle plugin 2.4.21 và KSP 2.3.12; ngôn ngữ Kotlin giữ ở 2.2 để phù hợp mã các thư viện React Native. Xem [bảng tương thích Kotlin với Gradle và AGP](https://kotlinlang.org/docs/gradle-configure-project.html) và [bản phát hành KSP](https://github.com/google/ksp/releases/tag/2.3.12).

Bản debug ARM64 đã build thành công bằng lệnh sau (chạy trong thư mục `android`, sau khi đặt JDK/SDK như trên):

```powershell
.\gradlew.bat assembleDebug --console=plain --max-workers=2 -PreactNativeArchitectures=arm64-v8a '-Pkotlin.compiler.execution.strategy=in-process' '-Pkotlin.incremental=false'
```

Kiểm tra thao tác trên thiết bị:

1. Mở lần đầu: thấy 3/4 sân hoạt động, đủ 4 sân và 3 lịch mẫu.
2. Thêm tên rỗng, tên trùng hoặc giá 0: thấy lỗi dưới ô và viền đỏ. Sửa sân vẫn giữ tên cũ được.
3. Xoá A1: bị chặn vì có lịch. Xoá A2: hỏi xác nhận; chọn Giữ lại thì sân còn nguyên.
4. Mở A1, nhập lịch 18h–20h cùng ngày mẫu: bị chặn. Đặt 19h–20h: thành công, tiền 300.000 đ.
5. Nhập SĐT sai, ngày 31/02/2026, bắt đầu 5h, thuê 4 giờ hoặc 22h thuê 2 giờ: bị chặn. 22h thuê 1 giờ được phép nếu không trùng.
6. Mở B2: nút Đặt sân bị khoá. Đổi sang Hoạt động thì đặt được.
7. Huỷ lịch: có xác nhận. Huỷ hết lịch của một sân thì xoá sân được.
8. Đóng hẳn và mở lại ứng dụng: dữ liệu đã thay đổi còn nguyên. Xoá hết lịch và sân rồi mở lại: danh sách vẫn rỗng.
9. Mở bàn phím trong form và Modal, cuộn tới ô cuối và nút lưu; kiểm tra vùng tai thỏ/thanh điều hướng.


