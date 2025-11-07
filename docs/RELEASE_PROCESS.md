# Monorepo 发布工作指引

## 目标
- **统一日志**：所有包共享一份顶层 Release log，并在各自 `CHANGELOG.md` 中保留独立条目。
- **自动打 tag**：Changesets 负责子包语义化 tag，新工作流额外生成聚合根 tag。
- **稳定可回滚**：发布前必须经过测试、构建、类型检查，失败自动阻断。

## 流程总览
1. **功能开发**：在功能分支中提交，改动影响的包必须运行 `pnpm changeset`，选择对应包和版本级别，PR 描述附上变化摘要。
2. **Release PR**：合入 `main` 时由 `.github/workflows/release-pr.yml` 自动生成 `Release packages` PR，审阅者需确认：
   - `pnpm changeset status` 输出包含全部待发包。
   - `pnpm test`、`pnpm build`、`pnpm biome check` 均通过。
3. **合并**：审批后合并该 PR，`main` 上将出现已 bump 版本与更新过的 `CHANGELOG`。
4. **执行发布**：
   - 在 GitHub Actions 中手动运行 **Monorepo Release**（默认立即发布）。
   - 如需演练，可勾选 `dry_run`，此模式不会推送 tag 或发布到 npm。
5. **审核结果**：工作流结束后会自动：
   - 通过 `pnpm changeset publish` 向 npm 发布所有待发包并创建包级 tag。
   - 生成 `release-notes.md` 上传到 GitHub Release，聚合各包日志。
   - 依据 `packages/ziwei/package.json` 版本生成聚合 tag（默认 `@ziweijs/ziwei@x.y.z`）。

## 日志与标签规范
- **包级日志**：Changesets 自动写入 `packages/*/CHANGELOG.md`，勿手工编辑。
- **顶层 Release Log**：`release-notes.md` 由 `pnpm changeset status --output` 生成，作为 GitHub Release 描述。
- **Git Tag**：
  - 子包：`changeset publish` 自动打 `@scope/pkg@version`。
  - 聚合：新工作流创建 `TAG_PREFIX@<packages/ziwei version>`，默认 `TAG_PREFIX=@ziweijs/ziwei`，可在手动触发时覆盖。

## 所需密钥与权限
- `secrets.NPM_TOKEN`：发布 npm 包必须具备 `automation` 权限。
- `GITHUB_TOKEN`：默认即可推送 tag、创建 Release；若需要私有仓库跨组织访问，可改用 PAT。

## 故障处理
- 发布失败会中断在对应步骤，可重新运行工作流。
- 若部分包已发布但根 tag 未推送，重新运行前需删除 npm 版本或在下一次更改时提升版本。
- 若需临时跳过发版，可在 Release PR 中移除所有 changeset（关闭 PR），等待下一次累积。
