#!/usr/bin/env python3
"""
Terminology Consistency Checker for Patent Documents

用于检查专利文档中的术语一致性，确保全文使用统一的技术术语。

目标: 术语一致性 ≥ 90%

Usage:
    python3 term_checker.py <patent_document_path> <terminology_database_path>
"""

import sys
import re
import json
from pathlib import Path
from typing import List, Dict, Tuple, Set


class TermChecker:
    """术语一致性检查器"""

    def __init__(self, threshold: float = 0.90):
        """
        初始化术语检查器

        Args:
            threshold: 一致性阈值，默认0.90（90%）
        """
        self.threshold = threshold
        self.term_database = {}  # 标准术语库
        self.synonym_groups = []  # 同义词组

    def load_terminology(self, file_path: str):
        """
        加载术语库

        术语库格式（JSON）:
        {
            "standard_terms": {
                "联邦学习": ["标准术语", "应在全文统一使用"],
                "用户画像数据": ["标准术语"],
                ...
            },
            "synonym_groups": [
                ["联邦学习", "分布式学习", "联合学习"],
                ["用户画像", "用户数据", "用户特征"]
            ]
        }

        Args:
            file_path: 术语库文件路径
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            self.term_database = data.get('standard_terms', {})
            self.synonym_groups = data.get('synonym_groups', [])

        except FileNotFoundError:
            print(f"⚠️  术语库文件不存在: {file_path}")
            print("将使用空术语库进行检查。")
        except json.JSONDecodeError as e:
            print(f"❌ 术语库文件格式错误: {e}")
            sys.exit(2)

    def extract_terms(self, text: str) -> Dict[str, List[Tuple[int, str]]]:
        """
        从文本中提取术语及其位置

        Args:
            text: 专利文档文本

        Returns:
            {术语: [(行号, 上下文), ...]}
        """
        terms_found = {}

        # 按行处理
        lines = text.split('\n')

        for line_no, line in enumerate(lines, 1):
            # 检查术语库中的标准术语
            for term in self.term_database.keys():
                if term in line:
                    if term not in terms_found:
                        terms_found[term] = []
                    # 提取上下文（前后各20个字符）
                    match_pos = line.find(term)
                    context_start = max(0, match_pos - 20)
                    context_end = min(len(line), match_pos + len(term) + 20)
                    context = line[context_start:context_end]
                    terms_found[term].append((line_no, context))

            # 检查同义词组
            for synonym_group in self.synonym_groups:
                for synonym in synonym_group:
                    if synonym in line:
                        # 记录非标准术语
                        standard_term = synonym_group[0]  # 第一个为标准术语
                        if synonym != standard_term:
                            key = f"⚠️ {synonym} (建议: {standard_term})"
                            if key not in terms_found:
                                terms_found[key] = []
                            match_pos = line.find(synonym)
                            context_start = max(0, match_pos - 20)
                            context_end = min(len(line), match_pos + len(synonym) + 20)
                            context = line[context_start:context_end]
                            terms_found[key].append((line_no, context))

        return terms_found

    def check_consistency(self, text: str) -> Dict:
        """
        检查术语一致性

        Args:
            text: 专利文档文本

        Returns:
            检查结果字典
        """
        terms_found = self.extract_terms(text)

        # 分析一致性问题
        issues = []
        warnings = []

        # 检查同义词混用
        for synonym_group in self.synonym_groups:
            found_variants = [term for term in synonym_group if term in text]
            if len(found_variants) > 1:
                standard_term = synonym_group[0]
                issues.append({
                    'type': 'synonym_mixing',
                    'standard_term': standard_term,
                    'variants_found': found_variants,
                    'severity': 'high'
                })

        # 检查非标准术语使用
        for key in terms_found.keys():
            if key.startswith('⚠️'):
                warnings.append({
                    'type': 'non_standard_term',
                    'term': key,
                    'occurrences': terms_found[key],
                    'severity': 'medium'
                })

        # 计算一致性得分
        total_term_usages = sum(len(occurrences) for occurrences in terms_found.values())
        inconsistent_usages = sum(len(occurrences) for key, occurrences in terms_found.items() if key.startswith('⚠️'))

        if total_term_usages > 0:
            consistency_score = 1 - (inconsistent_usages / total_term_usages)
        else:
            consistency_score = 1.0

        # 判断是否通过
        passed = consistency_score >= self.threshold and len(issues) == 0

        return {
            'passed': passed,
            'consistency_score': consistency_score,
            'threshold': self.threshold,
            'total_term_usages': total_term_usages,
            'inconsistent_usages': inconsistent_usages,
            'issues': issues,
            'warnings': warnings,
            'terms_found': terms_found
        }

    def check_document(self, doc_path: str, term_db_path: str = None) -> Dict:
        """
        检查文档的术语一致性

        Args:
            doc_path: 文档路径
            term_db_path: 术语库路径（可选）

        Returns:
            检查结果字典
        """
        try:
            # 加载术语库
            if term_db_path:
                self.load_terminology(term_db_path)

            # 读取文档
            with open(doc_path, 'r', encoding='utf-8') as f:
                text = f.read()

            # 检查一致性
            return self.check_consistency(text)

        except FileNotFoundError:
            return {'error': f'文件不存在: {doc_path}'}
        except Exception as e:
            return {'error': f'处理文件时出错: {str(e)}'}

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

        score = result['consistency_score']
        threshold = result['threshold']
        passed = result['passed']
        issues = result['issues']
        warnings = result['warnings']

        # 状态emoji
        status = "✅ Pass" if passed else "❌ Fail"

        # 构建报告
        report = []
        report.append("=" * 60)
        report.append("Terminology Consistency Check Report")
        report.append("=" * 60)
        report.append("")
        report.append(f"Consistency Score: {score * 100:.2f}% ({status} - 目标≥{threshold * 100:.0f}%)")
        report.append(f"Total Term Usages: {result['total_term_usages']}")
        report.append(f"Inconsistent Usages: {result['inconsistent_usages']}")
        report.append("")

        # 严重问题（同义词混用）
        if issues:
            report.append("❌ Critical Issues (同义词混用):")
            report.append("-" * 60)
            for issue in issues:
                report.append(f"标准术语: {issue['standard_term']}")
                report.append(f"发现变体: {', '.join(issue['variants_found'])}")
                report.append(f"建议: 全文统一使用 '{issue['standard_term']}'")
                report.append("")

        # 警告（非标准术语）
        if warnings:
            report.append("⚠️  Warnings (非标准术语):")
            report.append("-" * 60)
            for warning in warnings[:5]:  # 最多显示5个
                term_key = warning['term']
                occurrences = warning['occurrences']
                report.append(f"{term_key}")
                for line_no, context in occurrences[:3]:  # 最多显示3个位置
                    report.append(f"  Line {line_no}: ...{context}...")
                report.append("")

            if len(warnings) > 5:
                report.append(f"... and {len(warnings) - 5} more warnings")
                report.append("")

        # 建议
        report.append("Recommendations:")
        report.append("-" * 60)
        if passed:
            report.append("✅ 术语一致性达标，全文术语使用规范。")
        else:
            report.append("⚠️  术语一致性未达标，建议:")
            report.append("   1. 全文统一使用标准术语（从术语库选择）")
            report.append("   2. 避免同义词混用（如'联邦学习'和'分布式学习'）")
            report.append("   3. 权利要求书与说明书术语保持一致")

        report.append("")
        report.append("=" * 60)

        return '\n'.join(report)


def create_sample_terminology():
    """创建示例术语库"""
    sample_terminology = {
        "standard_terms": {
            "联邦学习": ["标准术语", "分布式机器学习方法"],
            "用户画像数据": ["标准术语", "用户特征数据"],
            "第三方鉴权节点": ["标准术语", "可信第三方"],
            "差分隐私": ["标准术语", "隐私保护技术"],
            "模型训练": ["标准术语"],
            "数据加密": ["标准术语"],
            "权利要求": ["专利术语"],
            "技术方案": ["专利术语"],
            "有益效果": ["专利术语"]
        },
        "synonym_groups": [
            ["联邦学习", "分布式学习", "联合学习", "协作学习"],
            ["用户画像数据", "用户数据", "用户特征", "用户信息"],
            ["第三方鉴权节点", "可信第三方", "中间方", "第三方服务器"],
            ["差分隐私", "隐私保护", "隐私计算"],
            ["模型训练", "训练模型", "模型学习"],
            ["数据加密", "加密数据", "加密传输"]
        ]
    }

    return sample_terminology


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("Usage: python3 term_checker.py <patent_document_path> [terminology_database_path]")
        print("")
        print("Example:")
        print("  python3 term_checker.py /path/to/patent.txt /path/to/terminology.json")
        print("")
        print("如果未提供术语库，将使用默认术语库。")
        sys.exit(1)

    doc_path = sys.argv[1]
    term_db_path = sys.argv[2] if len(sys.argv) > 2 else None

    # 如果没有提供术语库，创建默认术语库
    if not term_db_path:
        import tempfile
        sample_term = create_sample_terminology()
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False, encoding='utf-8') as f:
            json.dump(sample_term, f, ensure_ascii=False, indent=2)
            term_db_path = f.name
        print("⚠️  未提供术语库，使用默认术语库（联邦学习领域）")
        print("")

    # 创建检查器
    checker = TermChecker(threshold=0.90)

    # 检查文档
    print(f"Checking document: {doc_path}")
    if term_db_path:
        print(f"Terminology database: {term_db_path}")
    print("")

    result = checker.check_document(doc_path, term_db_path)

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
