"""
update_filelist.py
扫描 LinK/ 和 JD/ 目录下的 .md 文件，自动更新对应的 filelist.json。
用法：在项目根目录运行 `python update_filelist.py` 即可。
"""
import json
import os
import sys

# 需要扫描的目录列表
TARGET_DIRS = ["LinK", "JD"]


def update_filelist(dir_path: str) -> bool:
    """
    扫描 dir_path 下的所有 .md 文件，按字典序升序排列，
    将文件名列表写入 dir_path/filelist.json。
    返回 True 表示有变更，False 表示无变更。
    """
    if not os.path.isdir(dir_path):
        print(f"  [跳过] 目录不存在: {dir_path}")
        return False

    # 收集所有 .md 文件
    md_files = sorted(
        f for f in os.listdir(dir_path)
        if f.endswith(".md") and os.path.isfile(os.path.join(dir_path, f))
    )

    json_path = os.path.join(dir_path, "filelist.json")

    # 读取现有列表，判断是否需要更新
    old_list = None
    if os.path.isfile(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as fh:
                old_list = json.load(fh)
        except (json.JSONDecodeError, IOError):
            old_list = None

    if old_list == md_files:
        print(f"  [不变] {dir_path}/  共 {len(md_files)} 道题，无需更新")
        return False

    # 写回
    with open(json_path, "w", encoding="utf-8") as fh:
        json.dump(md_files, fh, ensure_ascii=False, indent=2)
        fh.write("\n")

    print(f"  [更新] {dir_path}/  共 {len(md_files)} 道题 -> {json_path}")
    if old_list is not None:
        added = set(md_files) - set(old_list)
        removed = set(old_list) - set(md_files)
        if added:
            print(f"         新增: {', '.join(sorted(added))}")
        if removed:
            print(f"         移除: {', '.join(sorted(removed))}")
    return True


def main():
    root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(root)

    print("扫描题解目录并更新 filelist.json ...\n")

    any_changed = False
    for d in TARGET_DIRS:
        changed = update_filelist(d)
        any_changed = any_changed or changed

    print()
    if any_changed:
        print("完成。")
    else:
        print("所有目录均无变更。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
