# coding=utf-8
import cv2
import numpy as np

prev_frame = None


def work(frame):
    global prev_frame

    # ͼ����ǿ
    frame = cv2.convertScaleAbs(frame, alpha=1.0, beta=10)
    # �޸ĳߴ�Ϊԭ����1/2�����ټ���ʱ��
    frame = cv2.resize(frame, (frame.shape[1] // 2, frame.shape[0] // 2))
    # ת��Ϊ�Ҷ�ͼ��
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # ��˹ģ��ȥ����
    gray = cv2.GaussianBlur(gray, (21, 21), 10)


    if prev_frame is None:
        prev_frame = gray
        return None

    # �����ֵ��prev_frameΪ��Ƶ��һ֡
    frame_delta = cv2.absdiff(prev_frame, gray)

    # ��ֵ��
    thresh = cv2.threshold(frame_delta, 8, 255, cv2.THRESH_BINARY)[1]

    g = cv2.getStructuringElement(cv2.MORPH_RECT, (9, 9))
    # �����
    thresh = cv2.dilate(thresh, g, iterations=5)
    # ��ʴ��ԭ���ߴ�
    thresh = cv2.erode(thresh, g, iterations=5)
    # ������׷��
    cnt, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # ȥ��С����
    better = []
    for c in cnt:
        if c.size > 200:
            better.append(c)

    # ���ͨ��
    b, g, r = cv2.split(frame)
    a = np.ones(b.shape, dtype=b.dtype) * 255
    z = np.ones(b.shape, dtype=b.dtype) * 0

    # mask
    image_draw = cv2.merge((z, z, z, a))
    # png
    # image_merge = cv2.merge((b, g, r, a))
    # �������
    cv2.drawContours(image_draw, better, -1, (0, 0, 0, 0), -1, cv2.LINE_AA)

    return image_draw


def main():
    for i in range(501):
        print(i)
        path = 'images/' + '%04d.png' % i
        image = cv2.imread(path, cv2.IMREAD_UNCHANGED)
        image_merge = work(image)
        path = 'alpha/' + '%04d.png' % i
        if image_merge is not None:
            cv2.imwrite(path, image_merge)
            # cv2.imshow('test', image_merge)
        if cv2.waitKey(110) & 0xff == 27:
            break


if __name__ == '__main__':
    main()
