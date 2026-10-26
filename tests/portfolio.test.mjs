import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {projects,categories,subcategories,scopedProjects,getProject,profile} from '../dist/data.js';
import {INTERACTION_SPEED_MULTIPLIER} from '../dist/star-map.js';
const imagesOf=p=>[...p.images,...(p.galleries||[]).flatMap(g=>g.images)];
test('The supplied outline has twelve unique archives, without demo projects',()=>{
 assert.equal(projects.length,12);assert.equal(new Set(projects.map(p=>p.id)).size,12);
 assert.equal(getProject('orbit'),undefined);assert.equal(getProject('aura-speaker'),undefined);
 assert.equal(getProject('xingye-basketball-2026'),undefined);
 for(const p of projects){assert.ok(categories[p.cat]);assert.ok(subcategories.some(s=>s.cat===p.cat&&s.id===p.subcategory));assert.ok(fs.existsSync(new URL('../dist/'+p.cover,import.meta.url)));}
});
test('Design disciplines keep 2D for interface work and 3D for the venue and character archives',()=>{
 assert.deepEqual(scopedProjects('design','2d').map(p=>p.id),['billiards-ui']);
 assert.deepEqual(scopedProjects('design','3d').map(p=>p.id),['yantaishan-market','sai8-billiards-interior','yantaishan-venue','xingye-basketball-series','yaoyue-character']);
 assert.equal(scopedProjects('design','3d').filter(p=>p.group==='展厅设计').length,4);
 assert.equal(scopedProjects('design','3d').filter(p=>p.group==='游戏角色设计').length,1);
 assert.equal(getProject('yaoyue-character').title,'爻月 · 游戏角色设计');
 assert.equal(getProject('xingye-basketball-series').shortTitle,'兴业篮球杯系列设计');
});
test('Face tracking is reachable through both relevant disciplines without duplicating the project',()=>{
 assert.deepEqual(scopedProjects('code','vision').map(p=>p.id),['gimbal-face-tracking']);
 assert.deepEqual(scopedProjects('industrial','embedded').map(p=>p.id),['gimbal-face-tracking']);
 assert.equal(projects.filter(p=>p.id==='gimbal-face-tracking').length,1);
 assert.equal(scopedProjects('all').length,12);
});
test('Every archive carries a summary and background, and no role or video is invented',()=>{
 assert.equal(subcategories.length,7);for(const s of subcategories)assert.ok(scopedProjects(s.cat,s.id).length>0);
 for(const p of projects){assert.ok(p.summary.length>0);assert.ok(p.background.length>0);assert.equal(p.role,'');assert.equal(p.video,'');}
 for(const p of projects)for(const s of p.process){assert.ok(s.title.length>0);assert.ok(s.description.length>0);}
 for(const p of projects)for(const img of imagesOf(p))assert.ok(fs.existsSync(new URL('../dist/'+img.src,import.meta.url)),img.src);
 assert.equal(getProject('billiards-ui').images.length,1);
 assert.equal(INTERACTION_SPEED_MULTIPLIER,1.5);
});
test('The supplied 描述.txt copy lands on the matching archives',()=>{
 const ui=getProject('billiards-ui');
 assert.deepEqual(ui.contributions,['UI 绘制','前端开发']);
 assert.deepEqual(ui.process.map(s=>s.title),['跟随版本更迭绘制静态 UI','制作交互特效','PC 前端开发','接口联调']);
 assert.deepEqual(ui.technologies,[{label:'平面设计',value:'Figma、Photoshop'},{label:'前端框架',value:'React'}]);
 const venue=id=>getProject(id);
 for(const id of ['yantaishan-market','yantaishan-venue','xingye-basketball-series']){
  assert.deepEqual(venue(id).contributions,['3D 现实场地还原','搭建平面、美陈、物料、设备、灯光环境等相关内容']);
  assert.deepEqual(venue(id).process.map(s=>s.title),['平面设计','3D 场景还原','提交上级部门审核']);
  assert.ok(venue(id).technologies.some(t=>t.value.includes('Blender')));
 }
 const sai8=getProject('sai8-billiards-interior');
 assert.deepEqual(sai8.contributions,['主导门店设计并施工','3D 现实场地还原','风格化设计','CAD 还原场地设计施工图']);
 assert.ok(sai8.technologies.some(t=>t.value==='CAD'));
 const yaoyue=getProject('yaoyue-character');
 assert.deepEqual(yaoyue.process.map(s=>s.title),['原画','三维设计','PBR 流程制作']);
 assert.ok(yaoyue.technologies.some(t=>t.value.includes('ZBrush')));
});
test('Venue design archives keep the supplied sub-item groups and image counts',()=>{
 const groups=id=>getProject(id).galleries,count=id=>groups(id).flatMap(g=>g.images).length;
 assert.deepEqual(groups('yantaishan-market').map(g=>g.title),['人才市场 · 日间效果图','人才市场 · 夜间效果图']);
 assert.equal(count('yantaishan-market'),19);
 assert.deepEqual(groups('yantaishan-venue').map(g=>g.title),['天桥活动点位','演唱会场地']);
 assert.equal(count('yantaishan-venue'),9);
 assert.deepEqual(groups('xingye-basketball-series').map(g=>g.title),['分馆比赛 01','分馆比赛 02','分馆比赛 03','分馆比赛 04','分馆比赛 05','分馆比赛 06','福耀总决赛','兴业会议场地']);
 const g1=groups('xingye-basketball-series')[0],g6=groups('xingye-basketball-series')[5];
 assert.equal(g1.images.length,4);assert.ok(g1.images.every(i=>i.src.includes('branch6')&&i.caption.startsWith('分馆一')));
 assert.equal(g6.images.length,6);assert.ok(g6.images.every(i=>i.src.includes('branch1')&&i.caption.startsWith('分馆六')));
 assert.equal(count('xingye-basketball-series'),38);
 assert.equal(projects.filter(p=>(p.galleries||[]).length).length,3);
});
test('Newly supplied project imagery lands on the matching archive',()=>{
 assert.equal(getProject('sai8-billiards-interior').images.length,12);
 assert.equal(getProject('yaoyue-character').images.length,3);
 assert.deepEqual(getProject('mbti-zodiac-miniapp').images.map(i=>i.caption),['小程序首页','配对结果页']);
 for(const p of [getProject('sai8-billiards-interior'),getProject('yaoyue-character'),getProject('mbti-zodiac-miniapp')])
  assert.ok(p.images.every(i=>i.src.startsWith('assets/projects/')&&i.src.endsWith('.webp')));
 assert.equal(imagesOf(getProject('mbti-zodiac-miniapp')).every(i=>i.portrait),true);
});
test('Contact channels carry the supplied phone, wechat, email, zcool name and GitHub handle',()=>{
 assert.equal(profile.phone,'13123103919');assert.equal(profile.wechat,'13123103919');
 assert.equal(profile.email,'876791052@qq.com');assert.equal(profile.zcool,'阿卿AH');
 assert.equal(profile.github,'shelter-qing');assert.equal(profile.xiaohongshu,undefined);
});
