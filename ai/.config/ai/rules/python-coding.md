# Python Coding Rules

## Core Workflow

### Test Driven Design (TDD)

Unless explicitly told otherwise, ALWAYS write the test case before writing the implementation.
- Step 1: Write a failing test using `pytest`.
- Step 2: Verify it fails.
- Step 3: Write the minimal code to pass the test.
- Step 4: Refactor.

### Atomic Changes

Keep edits small and focused. Do not refactor unrelated code unless necessary for the current task.

### User Confirmation

If a request is ambiguous or risks breaking major functionality, ask the user for clarification before executing.

## Code Style & Standards

### PEP 8 Compliance

Strictly follow PEP 8 guidelines for formatting.

### Type Hinting

Use Python 3.12+ type hints. For example, use the modern union syntax (`X | Y`) instead of `Union[X, Y]`.

### Docstrings

Use Google-style docstrings for all modules, classes, and functions.

### Imports

Group imports: Standard Library > Third Party > Local Application.

## Architecture & Patterns

### Preferred Patterns

- Use Dependency Injection to decouple logic.
- Use the Repository Pattern for data access.

### Error Handling

Catch specific exceptions; never use bare `except:` or `except Exception:`.

## Testing Guidelines

### Framework

STRICTLY use `pytest`.

### Coverage

Aim for 95%+ code coverage
- If a change drops coverage below 95%, you must add tests to restore it before marking the task complete.

### Execution

Run tests using `uv run pytest` in the virtual environment.

## Technology Stack

### Python Version

3.12

### Package Manager

`uv`
- Use `uv run <command>` to execute scripts or tests in the virtual environment.
- Do not use `pip` or `poetry` commands.

### Linter/Formatter

`black`

## Documentation

- Update `README.md` if architectural overview changes.
- Update `pyproject.toml` if dependencies change.
- Ensure `pyproject.toml` is kept clean and organized by `uv`.

## Pull Request Review Process & What Reviewers Look For

- ✅ Checks pass (`uv run pytest`).
- ✅ Tests cover new behavior and edge cases.
- ✅ Code is readable, maintainable, and consistent with existing style.
- ✅ Public APIs and user-facing behavior changes are documented.
- ✅ Examples are updated if behavior changes.
- ✅ History is clean with a clear PR description.
