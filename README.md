# SuperWebPC

SuperWebPC là một website tĩnh chuyên về giới thiệu linh kiện máy tính, hỗ trợ xây dựng cấu hình PC và tư vấn lựa chọn sản phẩm bằng HTML5, CSS3 và JavaScript thuần.

## Tổng quan
- Giao diện hiện đại theo phong cách dark / glassmorphism.
- Hỗ trợ nhiều trang: Home, Components, Build PC, About và Contact.
- Cung cấp dữ liệu linh kiện thực tế để người dùng có thể tìm kiếm, lọc, xem chi tiết và tạo build phù hợp.
- Có tính năng kiểm tra tương thích phần cứng cơ bản và phần tóm tắt chi phí / công suất cho build.

## Tính năng nổi bật
- Trang chủ với hero section, sản phẩm nổi bật và gallery preview.
- Trang Components có tìm kiếm, bộ lọc theo danh mục, thương hiệu, giá, socket, DDR, platform, form factor, PCIe và sắp xếp.
- Trang Build PC cho phép chọn linh kiện theo từng nhóm và hiển thị tổng chi phí, công suất và độ tương thích.
- Trang About trình bày giá trị và quy trình hỗ trợ.
- Trang Contact có biểu mẫu tư vấn với kiểm tra dữ liệu trước khi gửi.
- Accessibility cơ bản: skip link, focus rõ ràng, semantic HTML và ARIA labels.

## Cấu trúc thư mục
- index.html: trang chủ.
- components.html: danh mục linh kiện.
- build.html: công cụ build PC.
- about.html: giới thiệu về dự án.
- contact.html: biểu mẫu liên hệ.
- css/: stylesheet cho theme, layout, responsive và animation.
- js/: dữ liệu linh kiện, helper, hành vi chung và logic cho catalog / builder / gallery.

## Chạy dự án
Bạn có thể mở trực tiếp các file HTML bằng trình duyệt, hoặc chạy một server tĩnh cục bộ.

Ví dụ:
```bash
python3 -m http.server 8000
```
Sau đó truy cập:
```text
http://localhost:8000
```

## Ghi chú
- Website được thiết kế để chạy hoàn toàn ở phía client mà không cần backend.
- Tất cả hình ảnh dùng URL trực tuyến, nên kết nối mạng cần ổn định để hiển thị đúng.
- Nếu muốn mở rộng, bạn có thể thêm dữ liệu sản phẩm mới vào js/data.js và chỉnh giao diện trong css/.