"""
Compatibility settings module.

This repository historically had two Django projects (`core` and `config`).
Deployments (e.g. Vercel) may still reference `core.settings`, so we keep this
module as a thin shim and load the real settings from `config.settings`.
"""

from config.settings import *  # noqa: F401,F403
