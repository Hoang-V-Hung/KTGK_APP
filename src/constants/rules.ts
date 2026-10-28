// Sửa các giá trị ở đây nếu đề yêu cầu đổi giờ mở cửa hoặc thời gian thuê.
// Form, kiểm tra dữ liệu và dữ liệu lưu trữ đều dùng chung các quy định này.
export const BOOKING_RULES = {
  earliestStartHour: 6,
  latestStartHour: 22,
  latestEndHour: 23,
  minHours: 1,
  maxHours: 3,
  phoneLength: 10,
};

export const FIELD_TYPES = ['5 người', '7 người'] as const;
export const FIELD_STATUSES = ['Hoạt động', 'Bảo trì'] as const;
