#!/usr/bin/env python3
"""
IRR (Inverse Repetition Rate) Checker for Patent Documents

借鉴AutoPatent的IRR指标，用于检测专利文档中的句子重复率。

IRR = 1 - (重复句子数 / 总句子数)
目标: IRR ≥ 0.85 (重复率 ≤ 15%)

Usage:
    python irr_checker.py <patent_document_path>
"""

import sys
import re
from pathlib import Path
from typing import List, Tuple, Dict
from collections import Counter


class IRRChecker:
    """IRR重复率检查器"""

    def __init__(self, threshold: float = 0.85):
        """
        初始化IRR检查器

        Args:
            threshold: IRR阈值，默认0.85（重复率≤15%）
        """
        self.threshold = threshold

    def extract_sentences(self, text: str) -> List[str]:
        """
        从文本中提取句子

        Args:
            text: 输入文本

        Returns:
            句子列表
        """
        # 中文句子分隔符
        sentences = re.split(r'[。！？；\n]', text)

        # 清理空句子和过短句子
        sentences = [s.strip() for s in sentences if s.strip() and len(s.strip()) > 5]

        return sentences

    def normalize_sentence(self, sentence: str) -> str:
        """
        标准化句子（去除空格、标点等）

        Args:
            sentence: 原始句子

        Returns:
            标准化后的句子
        """
        # 去除空格
        normalized = re.sub(r'\s+', '', sentence)

        # 去除标点符号（保留中文字符、数字、英文字母）
        normalized = re.sub(r'[^\u4e00-\u9fa5a-zA-Z0-9]', '', normalized)

        return normalized

    def calculate_irr(self, text: str) -> Tuple[float, Dict]:
        """
        计算IRR指标

        Args:
            text: 专利文档文本

        Returns:
            (IRR分数, 详细统计信息)
        """
        sentences = self.extract_sentences(text)
        total_sentences = len(sentences)

        if total_sentences == 0:
            return 1.0, {
                'total_sentences': 0,
                'unique_sentences': 0,
                'repetition_rate': 0.0,
                'repeated_sentences': []
            }

        # 标准化句子
        normalized_sentences = [self.normalize_sentence(s) for s in sentences]

        # 统计句子频率
        sentence_counts = Counter(normalized_sentences)

        # 找出重复的句子
        repeated = {sent: count for sent, count in sentence_counts.items() if count > 1}

        # 计算唯一句子数
        unique_sentences = len(sentence_counts)

        # 计算IRR
        irr = unique_sentences / total_sentences

        # 计算重复率
        repetition_rate = 1 - irr

        # 找出重复句子的原文
        repeated_sentences = []
        for norm_sent, count in repeated.items():
            # 找到第一个匹配的原句
            for original in sentences:
                if self.normalize_sentence(original) == norm_sent:
                    repeated_sentences.append({
                        'sentence': original[:100] + '...' if len(original) > 100 else original,
                        'count': count
                    })
                    break

        return irr, {
            'total_sentences': total_sentences,
            'unique_sentences': unique_sentences,
            'repetition_rate': repetition_rate,
            'repeated_sentences': repeated_sentences
        }

    def check_document(self, file_path: str) -> Dict:
        """
        检查专利文档的IRR

        Args:
            file_path: 文档路径

        Returns:
            检查结果字典
        """
        try:
            # 读取文件
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()

            # 计算IRR
            irr, stats = self.calculate_irr(text)

            # 判断是否通过
            passed = irr >= self.threshold

            return {
                'passed': passed,
                'irr': irr,
                'threshold': self.threshold,
                'stats': stats
            }

        except FileNotFoundError:
            return {
                'error': f'文件不存在: {file_path}'
            }
        except Exception as e:
            return {
                'error': f'处理文件时出错: {str(e)}'
            }

    def format_report(self, result: Dict) -> str:
        """
        格式化检查报告

        Args:
            result: 检查结果

        Returns:
            格式化的报告字符串
        """
        if 'error' in result:
            return f"❌ Error: {result['error']}"

        irr = result['irr']
        threshold = result['threshold']
        passed = result['passed']
        stats = result['stats']

        # 状态emoji
        status = "✅ Pass" if passed else "❌ Fail"

        # 构建报告
        report = []
        report.append("=" * 60)
        report.append("IRR (Inverse Repetition Rate) Check Report")
        report.append("=" * 60)
        report.append("")
        report.append(f"IRR Score: {irr:.4f} ({status} - 目标≥{threshold:.2f})")
        report.append(f"Unique Sentences: {stats['unique_sentences']} / {stats['total_sentences']}")
        report.append(f"Repetition Rate: {stats['repetition_rate'] * 100:.2f}%")
        report.append("")

        # 如果有重复句子，列出来
        if stats['repeated_sentences']:
            report.append("Repetitive Sentences Found:")
            report.append("-" * 60)
            for i, item in enumerate(stats['repeated_sentences'][:10], 1):  # 最多显示10个
                report.append(f"{i}. (重复{item['count']}次)")
                report.append(f"   {item['sentence']}")
                report.append("")

            if len(stats['repeated_sentences']) > 10:
                report.append(f"... and {len(stats['repeated_sentences']) - 10} more repeated sentences")
                report.append("")

        # 建议
        report.append("Recommendations:")
        report.append("-" * 60)
        if passed:
            report.append("✅ IRR指标达标，文档重复率控制良好。")
        else:
            report.append("⚠️  IRR指标未达标，建议:")
            report.append("   1. 变换表述方式（同一技术特征用不同角度描述）")
            report.append("   2. 增加技术细节（不同实施例补充不同参数）")
            report.append("   3. 避免模板化表述（减少套话）")

        report.append("")
        report.append("=" * 60)

        return '\n'.join(report)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("Usage: python irr_checker.py <patent_document_path>")
        print("")
        print("Example:")
        print("  python irr_checker.py /path/to/patent.txt")
        sys.exit(1)

    file_path = sys.argv[1]

    # 创建检查器
    checker = IRRChecker(threshold=0.85)

    # 检查文档
    print(f"Checking document: {file_path}")
    print("")

    result = checker.check_document(file_path)

    # 输出报告
    report = checker.format_report(result)
    print(report)

    # 返回退出码
    if 'error' in result:
        sys.exit(2)
    elif not result['passed']:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == '__main__':
    main()
