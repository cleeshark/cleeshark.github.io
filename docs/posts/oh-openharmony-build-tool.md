---
title: oh：一个面向 OpenHarmony 的编译命令管理工具
date: 2026-06-26
description: 梳理 oh 的安装、编译封装、多源码目录管理、同步流程、历史记录和资源查看能力。
categories:
  - 工具
tags:
  - OpenHarmony
  - Python
  - CLI
top: 1
recommend: 1
---

# oh：一个面向 OpenHarmony 的编译命令管理工具

`oh` 是一个用于简化 OpenHarmony 日常编译和源码维护操作的命令行工具。项目地址是 [https://gitcode.com/liyujie43/oh](https://gitcode.com/liyujie43/oh)。

OpenHarmony 源码体量大，日常开发里经常要反复执行 `build.sh`、`gn gen`、`ninja`、`repo sync`、`git lfs pull`、预编译脚本等命令。`oh` 的目标不是替代 OpenHarmony 原有构建系统，而是把这些高频命令封装成更短、更容易记忆、也更适合多源码目录管理的 CLI。

## 项目概览

这个项目结构很轻量，核心逻辑集中在一个 Python 文件里：

- `oh.py`：命令行入口和所有核心功能实现
- `install.sh`：安装脚本，会生成 `~/.local/bin/oh` 包装命令
- `README.md`：使用说明
- `CLAUDE.md`：项目维护和开发提示

项目依赖也比较少，运行环境主要需要：

- Python 3.6+
- git
- OpenHarmony 开发环境中常见的 `repo`、`git lfs`、`gn`、`ninja` 等工具

## 安装方式

官方 README 给出的安装方式是：

```bash
git clone https://gitcode.com/liyujie43/oh.git ~/.oh && bash ~/.oh/install.sh
```

安装脚本会做几件事：

1. 检查本机是否存在 `git` 和 `python3`。
2. 将项目放在 `~/.oh` 目录。
3. 在 `~/.local/bin/oh` 创建一个 shell wrapper。
4. 如果 `~/.local/bin` 不在 `PATH` 中，会提示是否写入 `~/.bashrc`。

安装完成后，可以直接执行：

```bash
oh
```

查看可用命令。

## 核心使用方式

最常用的命令是 `oh bd`，用于构造并执行 OpenHarmony 编译命令。例如：

```bash
cd /path/to/openharmony
oh bd ace_engine
```

默认情况下，它会生成类似下面的命令：

```bash
./build.sh --product-name rk3568 --ccache --build-target ace_engine --ninja-args=-j32
```

也可以通过参数覆盖默认配置：

```bash
oh bd ace_engine -p standard
oh bd ace_engine -j 16
oh bd ace_engine -nc
oh bd ace_engine -f
oh bd ace_engine -dr
```

这些参数分别表示：

- `-p`：指定产品名
- `-j`：指定 ninja 并发数
- `-nc`：禁用 ccache
- `-f`：追加快速重编译参数
- `-dr`：dry run，只打印命令，不实际执行

如果只想执行构建流程中的某一段，也可以使用：

```bash
oh bd -go
oh bd -no ace_engine
```

其中 `-go` 只执行 `gn gen`，`-no` 只执行 `ninja`。

## 多源码目录管理

OpenHarmony 开发中很常见的一种情况是本地同时维护多份源码，比如 master、release 或不同客户分支。`oh` 支持通过 `-d` 指定源码目录：

```bash
oh bd ace_engine -d /data/oh/master
oh bd ace_engine -d /data/oh/release
```

这样即使当前 shell 不在源码目录内，也可以对指定目录执行编译。

项目还支持在源码根目录生成 `.oh.ini`，用于保存目录级配置。`oh.py` 会从当前目录向上查找 `.oh.ini`，因此在源码子目录中执行命令时，也能定位到项目根目录。

## 配置机制

`oh` 的配置分为三层：

```text
内置默认值
  -> ~/.oh/config.ini
  -> <源码目录>/.oh.ini
```

优先级从低到高。也就是说，项目级 `.oh.ini` 会覆盖全局配置，全局配置会覆盖内置默认值。命令行参数则用于当前这一次执行的临时覆盖。

默认配置包括：

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `product` | `rk3568` | 默认产品名 |
| `target_cpu` | `arm64` | `gn gen` 时使用的目标 CPU |
| `ccache` | `true` | 是否默认启用 ccache |
| `build_prefix` | `./build.sh` | 默认构建入口 |
| `product_flag` | `--product-name` | 产品名参数 |
| `pre_cmd` | `bash build/prebuilts_download.sh` | 预编译命令 |

常见配置命令如下：

```bash
oh config
oh config product standard
oh config jobs 16
oh config --unset product
oh config --global
oh config --local
```

需要注意的是，当前代码中的配置默认项包含 `product`、`target_cpu`、`ccache`、`build_prefix`、`product_flag` 和 `pre_cmd`。如果要长期调整并发数，更直接的方式仍然是在执行 `oh bd` 时使用 `-j`，或结合资源检测使用 `-a`。

## 源码初始化与同步

除了编译，`oh` 还封装了源码初始化和同步命令。

初始化 OpenHarmony 仓库：

```bash
oh init /data/oh/master -b master
```

下载源码：

```bash
oh download /data/oh/master
```

更新已有源码：

```bash
oh update
```

一键清理、同步、拉取 LFS 并执行预编译：

```bash
oh sync
```

`oh update` 和 `oh sync` 内部会调用 `repo sync` 和 `repo forall -c 'git lfs pull'`。如果 `repo sync` 中有项目失败，代码里还会尝试从 `.repo/manifest.xml` 解析失败项目的路径，并对失败项目进行重试。

这对 OpenHarmony 这种多仓库源码树比较实用，因为同步失败往往不是整个工程都失败，而是少数 project 拉取异常。

## 清理和重编译辅助

`oh` 也提供了一些日常维护命令：

```bash
oh rm ace_engine
oh clear
oh pre
```

其中：

- `oh rm <target>` 会在 `out` 目录下查找并删除指定 target 的编译产物。
- `oh clear` 会执行 `repo forall -c 'git reset --hard && git clean -fd'`，用于清理所有仓库未提交修改。
- `oh pre` 会执行配置项 `pre_cmd` 指定的预编译命令。

`oh clear` 是破坏性操作，会丢弃未提交代码。执行前最好确认本地修改已经提交或备份。

## 历史记录与重放

`oh` 会把部分执行过的命令记录到 `~/.oh/history.json`，最多保留 100 条，并使用文件锁避免并发写入损坏。

查看历史：

```bash
oh history
```

重新执行上一条命令：

```bash
oh redo
```

重新执行指定编号的历史命令：

```bash
oh redo 3
```

这对反复调试同一个 target 很方便，尤其是编译命令参数较长时。

## 系统资源查看

OpenHarmony 编译通常比较吃 CPU 和内存。`oh` 提供了几个面向编译机器的资源查看命令：

```bash
oh res
oh mem
oh clang
```

`oh res` 会读取 `/proc/stat` 和 `/proc/meminfo`，估算 CPU 空闲率、空闲核心数、可用内存，并给出建议的编译并发数。

`oh mem` 会按用户汇总当前进程占用的内存。

`oh clang` 会统计各用户的 `clang`、`ld.lld`、`lld` 相关进程数量。

这些命令更偏 Linux 编译服务器场景，适合多人共用机器时判断当前是否适合开大并发。

## 适用场景

我觉得 `oh` 最适合以下几类 OpenHarmony 开发场景：

- 经常编译固定 target，不想反复输入长命令。
- 本机或服务器上维护多份 OpenHarmony 源码。
- 需要在 `repo sync`、`git lfs pull`、预编译之间频繁切换。
- 希望把产品名、构建入口、预编译命令等默认参数固化到配置文件里。
- 多人共用编译服务器，需要查看资源占用和 clang 进程数量。

它的价值主要在于把 OpenHarmony 日常开发里的机械命令收口到一个统一入口，而不是创造新的构建流程。

## 注意点

这个工具当前实现非常直接，优点是容易理解和修改，但使用时也有几点需要注意：

1. `oh clear` 会重置并清理所有 repo 子仓，未提交修改会丢失。
2. `oh.py` 大量使用 `subprocess.run(..., shell=True)`，因此配置项和额外参数应只写可信命令。
3. 资源查看命令依赖 Linux 的 `/proc` 和 `ps`，不适合 Windows 原生环境。
4. README 中提到的部分参数需要以当前代码实现为准；使用前可以通过 `oh -h` 查看实际支持的命令。

## 总结

`oh` 是一个面向 OpenHarmony 开发者的轻量级效率工具。它没有引入复杂框架，而是用一个 Python 脚本把编译、同步、清理、预编译、历史记录和资源查看串起来。

如果你每天都要和 OpenHarmony 源码树打交道，这类工具能节省不少重复输入命令的时间，也能减少因为切错目录、漏加参数、忘记预编译而带来的低级错误。
