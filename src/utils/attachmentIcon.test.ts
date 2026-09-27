import { describe, expect, it } from 'vitest'
import { FALLBACK_ATTACHMENT_ICON, getAttachmentIcon } from './attachmentIcon'

const SAMPLE_URL = 'https://www.ustc.edu.cn/files/attachment'

describe('getAttachmentIcon', () => {
  it.each([
    ['报名表.pdf', '$filePdf'],
    ['报名表.PDF', '$filePdf'],
    ['工作方案.docx', '$fileWord'],
    ['登记表.doc', '$fileWord'],
    ['成绩汇总.xlsx', '$fileExcel'],
    ['统计结果.csv', '$fileExcel'],
    ['答辩汇报.pptx', '$filePowerpoint'],
    ['讲座海报.jpg', '$fileImage'],
    ['充电桩分布图.png', '$fileImage'],
    ['校徽.svg', '$fileImage'],
    ['讲座录音.mp3', '$fileMusic'],
    ['宣传视频.mp4', '$fileVideo'],
    ['申报材料.zip', '$folderZip'],
    ['归档数据.7z', '$folderZip'],
    ['使用说明.txt', '$textBox'],
    ['操作指南.md', '$textBox'],
    ['配置文件.json', '$fileCode'],
    ['处理脚本.py', '$fileCode'],
    ['页面.html', '$fileCode'],
  ])('maps %s to %s', (name, icon) => {
    expect(getAttachmentIcon(name, SAMPLE_URL)).toBe(icon)
  })

  it('falls back to the URL path when the name has no extension', () => {
    expect(getAttachmentIcon('附件', 'https://www.ustc.edu.cn/files/guide.pdf')).toBe('$filePdf')
    expect(getAttachmentIcon('附件', 'https://www.ustc.edu.cn/files/photo.JPG')).toBe('$fileImage')
  })

  it('ignores query strings and fragments in the URL', () => {
    expect(
      getAttachmentIcon('附件', 'https://www.ustc.edu.cn/download/guide.pdf?token=1#page=2'),
    ).toBe('$filePdf')
    expect(getAttachmentIcon('', 'https://www.ustc.edu.cn/files/')).toBe(FALLBACK_ATTACHMENT_ICON)
  })

  it('decodes percent-encoded URL segments', () => {
    expect(
      getAttachmentIcon('', 'https://www.ustc.edu.cn/files/%E6%8A%A5%E5%90%8D%E8%A1%A8.xlsx'),
    ).toBe('$fileExcel')
    expect(getAttachmentIcon('', 'https://www.ustc.edu.cn/files/report%2Epdf')).toBe('$filePdf')
  })

  it('prefers the name extension and falls back to the URL for unknown names', () => {
    expect(getAttachmentIcon('附件.bin', 'https://www.ustc.edu.cn/files/attachment.pdf')).toBe(
      '$filePdf',
    )
    expect(getAttachmentIcon('附件.pdf', 'https://www.ustc.edu.cn/files/attachment.zip')).toBe(
      '$filePdf',
    )
  })

  it('falls back to the download icon for missing or unknown file types', () => {
    expect(getAttachmentIcon('附件', 'https://www.ustc.edu.cn/download?id=1')).toBe(
      FALLBACK_ATTACHMENT_ICON,
    )
    expect(getAttachmentIcon('README', SAMPLE_URL)).toBe(FALLBACK_ATTACHMENT_ICON)
    expect(getAttachmentIcon('附件.unknown', 'https://www.ustc.edu.cn/files/data.unknown')).toBe(
      FALLBACK_ATTACHMENT_ICON,
    )
    expect(getAttachmentIcon('', '')).toBe(FALLBACK_ATTACHMENT_ICON)
  })

  it('stays total on malformed or unsafe input', () => {
    expect(getAttachmentIcon('javascript:alert(1)', 'javascript:alert(1)')).toBe(
      FALLBACK_ATTACHMENT_ICON,
    )
    expect(getAttachmentIcon('%E0%A4%A', 'https://www.ustc.edu.cn/files/%E0%A4%A.pdf')).toBe(
      '$filePdf',
    )
    expect(getAttachmentIcon(' 报告.PDF  ', SAMPLE_URL)).toBe('$filePdf')
  })
})
