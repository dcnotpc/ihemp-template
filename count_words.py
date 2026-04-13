#!/usr/bin/env python3
import re
import sys

def count_content_words(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove frontmatter (between --- markers)
    content = re.sub(r'^---\n.*?\n---', '', content, flags=re.DOTALL | re.MULTILINE)
    
    # Remove HTML comments
    content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
    
    # Remove markdown comments (if any)
    content = re.sub(r'^\s*//.*$', '', content, flags=re.MULTILINE)
    
    # Remove internal linking suggestions section
    content = re.sub(r'^<!-- SEO: Internal linking suggestions -->.*?^---$', '', content, flags=re.DOTALL | re.MULTILINE)
    
    # Remove disclaimers section for word count (as they're boilerplate)
    # But let's keep them for now since they're part of the published content
    
    # Count words
    words = re.findall(r'\b\w+\b', content)
    return len(words)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python count_words.py <filepath>")
        sys.exit(1)
    
    word_count = count_content_words(sys.argv[1])
    print(f"Content word count: {word_count}")