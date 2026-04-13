#!/usr/bin/env python3
"""
iHemp Daily Operations Dashboard
Generates Option A report: Operations focused
"""

import subprocess
import json
import os
import sys
from datetime import datetime
import requests
from pathlib import Path

workspace = Path("/home/dcnotpc420/.openclaw/workspace")

def run_cmd(cmd):
    """Run command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout.strip() if result.returncode == 0 else ""
    except Exception as e:
        return f"Error: {e}"

def get_openclaw_status():
    """Get OpenClaw status info"""
    try:
        output = run_cmd("openclaw status")
        if not output:
            return {"error": "No status output"}
        
        status = {
            "raw": output[:200] + "..." if len(output) > 200 else output,
            "tokens": "Unknown",
            "cost": "Unknown",
            "context": "Unknown"
        }
        
        lines = output.split('\n')
        for line in lines:
            if "🧮 Tokens" in line:
                status["tokens"] = line.strip()
            elif "💵 Cost" in line:
                status["cost"] = line.strip()
            elif "📦 Context" in line:
                status["context"] = line.strip()
        
        return status
    except Exception as e:
        return {"error": str(e)}

def get_vercel_deployments():
    """Check Vercel deployment status"""
    try:
        # Use the check-deployments.py script
        result = subprocess.run(
            [sys.executable, workspace / "check-deployments.py"],
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            return {"error": f"Script error: {result.stderr[:200]}"}
        
        # Parse output
        lines = result.stdout.split('\n')
        projects_found = 0
        ready_deployments = 0
        errors = []
        
        current_project = None
        for line in lines:
            if "Found" in line and "iHemp projects" in line:
                try:
                    parts = line.split()
                    projects_found = int(parts[1])
                except:
                    pass
            elif "📋" in line:
                current_project = line.strip()
            elif "State:" in line and "Ready:" in line:
                if "Ready: READY" in line or "Ready: ready" in line:
                    ready_deployments += 1
            elif "❌" in line or "Trigger failed" in line:
                errors.append(line.strip())
        
        return {
            "total_projects": projects_found,
            "ready_deployments": ready_deployments,
            "errors": errors[:5],  # Limit errors
            "raw_summary": result.stdout[:500] + "..." if len(result.stdout) > 500 else result.stdout
        }
    except Exception as e:
        return {"error": str(e)}

def check_state_urls():
    """Check state law URL health"""
    try:
        # Use check-state-law-urls.py
        result = subprocess.run(
            [sys.executable, workspace / "check-state-law-urls.py"],
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            return {"error": f"Script error: {result.stderr[:200]}"}
        
        # Parse for summary
        lines = result.stdout.split('\n')
        working = 0
        broken = 0
        critical_issues = []
        
        for line in lines:
            if "✅" in line and "200" in line:
                working += 1
            elif "❌" in line:
                broken += 1
                if "404" in line or "403" in line or "SSL" in line:
                    # Extract state name
                    parts = line.split()
                    if parts:
                        state = parts[0].replace("❌", "").strip()
                        issue = " ".join(parts[1:])[:100]
                        critical_issues.append(f"{state}: {issue}")
        
        return {
            "working_urls": working,
            "broken_urls": broken,
            "total_tested": working + broken,
            "critical_issues": critical_issues[:5],
            "health_percentage": round(working / (working + broken) * 100, 1) if (working + broken) > 0 else 0
        }
    except Exception as e:
        return {"error": str(e)}

def check_content_pipeline():
    """Check content pipeline status from memory"""
    try:
        # Check for recent blog posts
        blog_patterns = ["california-hemp-blog-post", "draft-", "blog-"]
        blog_files = []
        for file in workspace.glob("*.md"):
            for pattern in blog_patterns:
                if pattern in file.name.lower():
                    blog_files.append(file.name)
                    break
        
        # Check for drafts vs published
        draft_count = 0
        for file in blog_files:
            if "draft" in file.lower() or "unpublished" in file.lower():
                draft_count += 1
        
        # Check memory for recent activity
        memory_files = list(workspace.glob("memory/*.md"))
        recent_memory = []
        for mem in memory_files[-3:]:  # Last 3 memory files
            try:
                with open(mem) as f:
                    content = f.read(1000)
                    # Look for keywords
                    if "blog" in content.lower() or "content" in content.lower():
                        recent_memory.append(mem.stem)
            except:
                pass
        
        return {
            "total_blog_files": len(blog_files),
            "drafts": draft_count,
            "published": len(blog_files) - draft_count,
            "recent_memory_entries": recent_memory
        }
    except Exception as e:
        return {"error": str(e)}

def check_compliance():
    """Check compliance status"""
    try:
        # Read SOUL.md for compliance rules
        soul_path = workspace / "SOUL.md"
        with open(soul_path) as f:
            soul_content = f.read()
        
        compliance_keywords = ["FDA", "FTC", "2018 Farm Bill", "THC", "health claim"]
        keyword_counts = {}
        for keyword in compliance_keywords:
            keyword_counts[keyword] = soul_content.count(keyword)
        
        # Check AGENTS.md for compliance agent status
        agents_path = workspace / "AGENTS.md"
        if agents_path.exists():
            with open(agents_path) as f:
                agents_content = f.read()
                compliance_in_agents = "Compliance Agent" in agents_content
        else:
            compliance_in_agents = False
        
        return {
            "compliance_keywords_found": sum(keyword_counts.values()),
            "compliance_agent_configured": compliance_in_agents,
            "keyword_counts": keyword_counts
        }
    except Exception as e:
        return {"error": str(e)}

def generate_report():
    """Generate comprehensive operations dashboard"""
    
    print("🌿 Collecting data for iHemp Daily Operations Dashboard...")
    
    # Collect all data
    openclaw_status = get_openclaw_status()
    vercel_status = get_vercel_deployments()
    url_status = check_state_urls()
    content_status = check_content_pipeline()
    compliance_status = check_compliance()
    
    # Current date/time
    now = datetime.now()
    eastern_time = now.strftime("%Y-%m-%d %H:%M:%S %Z")
    
    # Build report
    report_lines = [
        "🌿 iHEMP DAILY OPERATIONS DASHBOARD",
        "=" * 70,
        f"📅 Report Date: {eastern_time}",
        "",
        "📊 OPENCLAW STATUS",
        "-" * 30,
    ]
    
    if "error" not in openclaw_status:
        if openclaw_status.get("tokens") != "Unknown":
            report_lines.append(f"   {openclaw_status['tokens']}")
        if openclaw_status.get("cost") != "Unknown":
            report_lines.append(f"   {openclaw_status['cost']}")
        if openclaw_status.get("context") != "Unknown":
            report_lines.append(f"   {openclaw_status['context']}")
    else:
        report_lines.append(f"   ❌ Status unavailable: {openclaw_status.get('error', 'Unknown error')}")
    
    report_lines.extend([
        "",
        "🚀 VERCEL DEPLOYMENTS",
        "-" * 30,
    ])
    
    if "error" not in vercel_status:
        report_lines.append(f"   📦 Total Projects: {vercel_status.get('total_projects', 0)}")
        report_lines.append(f"   ✅ Ready Deployments: {vercel_status.get('ready_deployments', 0)}")
        
        errors = vercel_status.get('errors', [])
        if errors:
            report_lines.append(f"   ⚠️  Errors Found: {len(errors)}")
            for err in errors[:3]:
                report_lines.append(f"      • {err}")
        else:
            report_lines.append("   ✅ No deployment errors")
    else:
        report_lines.append(f"   ❌ Deployment check failed: {vercel_status.get('error', 'Unknown error')}")
    
    report_lines.extend([
        "",
        "🔗 STATE LAW URL HEALTH",
        "-" * 30,
    ])
    
    if "error" not in url_status:
        report_lines.append(f"   🌐 URLs Tested: {url_status.get('total_tested', 0)}")
        report_lines.append(f"   ✅ Working URLs: {url_status.get('working_urls', 0)}")
        report_lines.append(f"   ❌ Broken URLs: {url_status.get('broken_urls', 0)}")
        report_lines.append(f"   📊 Health Score: {url_status.get('health_percentage', 0)}%")
        
        issues = url_status.get('critical_issues', [])
        if issues:
            report_lines.append(f"   ⚠️  Critical Issues ({len(issues)}):")
            for issue in issues[:3]:
                report_lines.append(f"      • {issue}")
    else:
        report_lines.append(f"   ❌ URL check failed: {url_status.get('error', 'Unknown error')}")
    
    report_lines.extend([
        "",
        "📝 CONTENT PIPELINE",
        "-" * 30,
    ])
    
    if "error" not in content_status:
        report_lines.append(f"   📄 Total Blog Files: {content_status.get('total_blog_files', 0)}")
        report_lines.append(f"   📋 Drafts: {content_status.get('drafts', 0)}")
        report_lines.append(f"   📤 Published: {content_status.get('published', 0)}")
        
        memory_entries = content_status.get('recent_memory_entries', [])
        if memory_entries:
            report_lines.append(f"   🗓️  Recent Activity: {', '.join(memory_entries)}")
        else:
            report_lines.append("   ℹ️  No recent content activity detected")
    else:
        report_lines.append(f"   ❌ Content check failed: {content_status.get('error', 'Unknown error')}")
    
    report_lines.extend([
        "",
        "⚖️ COMPLIANCE STATUS",
        "-" * 30,
    ])
    
    if "error" not in compliance_status:
        report_lines.append(f"   🔍 Compliance Keywords: {compliance_status.get('compliance_keywords_found', 0)}")
        report_lines.append(f"   🤖 Compliance Agent: {'✅ Configured' if compliance_status.get('compliance_agent_configured') else '❌ Not found'}")
        
        # Show key compliance indicator
        if compliance_status.get('compliance_keywords_found', 0) > 10:
            report_lines.append("   ✅ Strong compliance framework detected")
        else:
            report_lines.append("   ⚠️  Check compliance documentation")
    else:
        report_lines.append(f"   ❌ Compliance check failed: {compliance_status.get('error', 'Unknown error')}")
    
    report_lines.extend([
        "",
        "🚨 CRITICAL ALERTS",
        "-" * 30,
    ])
    
    alerts = []
    
    # Check for critical conditions
    if "error" not in vercel_status and vercel_status.get('total_projects', 0) == 0:
        alerts.append("⚠️  No Vercel projects found! Check API token and Vercel setup.")
    
    if "error" not in url_status and url_status.get('broken_urls', 0) > 5:
        alerts.append(f"⚠️  {url_status.get('broken_urls')} broken URLs need fixing")
    
    if "error" not in content_status and content_status.get('total_blog_files', 0) == 0:
        alerts.append("⚠️  No blog content found. Content pipeline may be empty.")
    
    if alerts:
        for alert in alerts:
            report_lines.append(f"   {alert}")
    else:
        report_lines.append("   ✅ No critical alerts at this time")
    
    report_lines.extend([
        "",
        "📋 RECOMMENDED ACTIONS",
        "-" * 30,
        "   [ ] Review broken URLs if any",
        "   [ ] Check Vercel deployment status",
        "   [ ] Review OpenRouter spending limits",
        "   [ ] Plan next content batch",
        "   [ ] Weekly compliance review",
        "",
        "📊 SYSTEM OVERVIEW",
        "-" * 30,
        f"   • Total Monitoring Checks: 5",
        f"   • Last Update: {now.strftime('%H:%M:%S')}",
        f"   • Report Version: 1.0",
        "",
        "=" * 70,
        "🌿 iHemp AI Operations System | Flint, Michigan",
        "=" * 70
    ])
    
    return "\n".join(report_lines)

def save_report(report, format="txt"):
    """Save report to file"""
    reports_dir = workspace / "reports" / "daily"
    reports_dir.mkdir(parents=True, exist_ok=True)
    
    filename = f"ihemp-dashboard-{datetime.now().strftime('%Y%m%d-%H%M')}.{format}"
    filepath = reports_dir / filename
    
    with open(filepath, 'w') as f:
        f.write(report)
    
    # Also save to workspace for easy access
    workspace_path = workspace / "daily-operations-dashboard.txt"
    with open(workspace_path, 'w') as f:
        f.write(report)
    
    return str(filepath), str(workspace_path)

def main():
    """Main function"""
    print("🌿 iHemp Daily Operations Dashboard Generator")
    print("=" * 70)
    
    # Generate report
    report = generate_report()
    
    # Print to console
    print("\n" + report)
    
    # Save report
    txt_path, workspace_path = save_report(report, "txt")
    print(f"\n💾 Report saved to workspace: {workspace_path}")
    print(f"📁 Detailed report: {txt_path}")
    
    return report

if __name__ == "__main__":
    main()