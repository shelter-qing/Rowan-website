#!/usr/bin/env python3
"""Convert the owner's supplied project imagery into web-optimised WebP files.

Source: C:/Users/yunmu/Desktop/个人网页说明  (one folder per project / sub-item)

Each entry below maps one source folder to a project in dist/data.js:
  group=None   -> the images land in the project's flat `images` array
  group='...'  -> they land in a named sub-group of `galleries`

Outputs WebP files into dist/assets/projects/ and venue-manifest.json, which is
used to rebuild the image blocks in dist/data.js (see patch-data.mjs).

Usage:
  python build-project-images.py            # rebuild everything
  python build-project-images.py 爻月 赛8    # only folders matching a keyword
"""
import json, os, re, sys
from PIL import Image

SRC = r'C:/Users/yunmu/Desktop/个人网页说明'
OUT = r'E:/rowan-website1026/rowan-website/dist/assets/projects'
MANIFEST = r'E:/rowan-website1026/rowan-website/venue-manifest.json'
MAX_WIDTH = 1920
QUALITY = 86

ENTRIES = [
    # ---- 场地设计 · 烟台山（人才市场归 2D 条目，其余归 3D 条目）----
    dict(folder='场地设计-烟台山系列/说明图集-人才市场', project='yantaishan-market',
         group='人才市场 · 日间效果图', en='DAY VIEW', prefix='yantaishan-market-day', caption='日景',
         match=lambda f: f.startswith('白天')),
    dict(folder='场地设计-烟台山系列/说明图集-人才市场', project='yantaishan-market',
         group='人才市场 · 夜间效果图', en='NIGHT VIEW', prefix='yantaishan-market-night', caption='夜景',
         match=lambda f: f.startswith('晚上')),
    dict(folder='场地设计-烟台山系列/说明图集-天桥活动点位', project='yantaishan-venue',
         group='天桥活动点位', en='BRIDGE POINT', prefix='yantaishan-venue-bridge', caption='天桥点位'),
    dict(folder='场地设计-烟台山系列/说明图集-演唱会', project='yantaishan-venue',
         group='演唱会场地', en='CONCERT', prefix='yantaishan-venue-concert', caption='演唱会'),
    # ---- 场地设计 · 兴业篮球杯系列（多场地）----
    dict(folder='场地设计-兴业系列/兴业会议场地', project='xingye-basketball-series',
         group='兴业会议场地', en='MEETING VENUE', prefix='xingye-series-meeting', caption='会议场地'),
    *[dict(folder=f'场地设计-兴业系列/分馆比赛{n}', project='xingye-basketball-series',
           group=f'分馆比赛 {n:02d}', en=f'BRANCH MATCH {n:02d}',
           prefix=f'xingye-series-branch{n}', caption=f'分馆{num}')
      for n, num in zip(range(1, 7), '一二三四五六')],
    dict(folder='场地设计-兴业系列/福耀总决赛', project='xingye-basketball-series',
         group='福耀总决赛', en='GRAND FINAL', prefix='xingye-series-final', caption='总决赛'),
    # ---- 其他项目 ----
    dict(folder='游戏角色设计-爻月', project='yaoyue-character', group=None,
         prefix='yaoyue-character', caption='角色设计'),
    dict(folder='赛8朋客-门店风格化设计', project='sai8-billiards-interior', group=None,
         prefix='sai8-billiards-interior-store', caption='门店效果'),
    dict(folder='MBTI & 星座小程序', project='mbti-zodiac-miniapp', group=None, portrait=True, files=[
        ('首页.png', 'mbti-zodiac-miniapp-home', '小程序首页'),
        ('结果页.png', 'mbti-zodiac-miniapp-result', '配对结果页'),
    ]),
]


def natural_key(name):
    return [int(t) if t.isdigit() else t for t in re.split(r'(\d+)', name)]


def main():
    os.makedirs(OUT, exist_ok=True)
    keywords = sys.argv[1:]
    manifest, total_src, total_out = [], 0, 0

    for entry in ENTRIES:
        if keywords and not any(k in entry['folder'] for k in keywords):
            continue
        src_dir = os.path.join(SRC, *entry['folder'].split('/'))
        if entry.get('files'):
            files = entry['files']
        else:
            names = [f for f in os.listdir(src_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
            if entry.get('match'):
                names = [f for f in names if entry['match'](f)]
            names.sort(key=natural_key)
            files = [(n, f"{entry['prefix']}-{i:02d}", f"{entry['caption']} {i:02d}") for i, n in enumerate(names, 1)]

        images = []
        for name, target, caption in files:
            src = os.path.join(src_dir, name)
            total_src += os.path.getsize(src)
            img = Image.open(src).convert('RGB')
            if img.width > MAX_WIDTH:
                img = img.resize((MAX_WIDTH, round(img.height * MAX_WIDTH / img.width)), Image.LANCZOS)
            target_file = f'{target}.webp'
            img.save(os.path.join(OUT, target_file), 'WEBP', quality=QUALITY, method=6)
            total_out += os.path.getsize(os.path.join(OUT, target_file))
            images.append({'src': f'assets/projects/{target_file}', 'caption': caption})
            if entry.get('portrait'):
                images[-1]['portrait'] = True

        manifest.append({'project': entry['project'], 'title': entry.get('group'),
                         'en': entry.get('en'), 'images': images})
        print(f'{len(files):>3} 张  {entry["project"]:<26} {entry.get("group") or "（平铺图集）"}')

    with open(MANIFEST, 'w', encoding='utf-8') as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=1)

    print(f'\n合计 {sum(len(g["images"]) for g in manifest)} 张')
    print(f'原始 {total_src/1024/1024:.1f} MB -> WebP {total_out/1024/1024:.1f} MB')


if __name__ == '__main__':
    main()
