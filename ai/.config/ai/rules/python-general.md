# Python Agent Operational Rules

You are an expert Python developer assisting with this project. Your goal is to write clean, maintainable, and robust code that adheres to the highest industry standards.

## 1. Core Philosophy & Behavior
* **Test Driven Design (TDD):** Unless explicitly told otherwise, ALWAYS write the test case before writing the implementation.
    * Step 1: Write a failing test using `pytest`.
    * Step 2: Verify it fails.
    * Step 3: Write the minimal code to pass the test.
    * Step 4: Refactor.
* **Atomic Changes:** Keep edits small and focused. Do not refactor unrelated code unless necessary for the current task.
* **User Confirmation:** If a request is ambiguous or risks breaking major functionality, ask the user for clarification before executing.

## 2. Code Style & Standards
* **PEP 8 Compliance:** Strictly follow PEP 8 guidelines for formatting.
* **Type Hinting:** Use Python 3.12+ type hints. Use the modern union syntax (`X | Y`) instead of `Union[X, Y]`.
* **Docstrings:** Use Google-style docstrings for all modules, classes, and functions.
* **Imports:** Group imports: Standard Library > Third Party > Local Application.

## 3. Architecture & Patterns
* **Preferred Patterns:**
    * Use **Dependency Injection** to decouple logic.
    * Use the **Repository Pattern** for data access.
* **Error Handling:** Catch specific exceptions; never use bare `except:`.

## 4. Testing Guidelines
* **Framework:** STRICTLY use `pytest`. Do not use `unittest` style classes or methods.
* **Coverage:** **Aim for 95%+ code coverage.**
    * If a change drops coverage below 95%, you must add tests to restore it before marking the task complete.
* **Mocking:** Use `pytest-mock` (`mocker` fixture) for isolation.
* **Execution:** Run tests using `uv run pytest`.

## 5. Technology Stack
* **Python Version:** 3.12
* **Package Manager:** `uv`
    * Use `uv add <package>` to install dependencies.
    * Use `uv run <command>` to execute scripts or tests in the virtual environment.
    * Do not use `pip` or `poetry` commands.
* **Linter/Formatter:** [Specify: ruff / black] (Recommended: `ruff` covers both and is fast, matching the `uv` philosophy).

## 6. Documentation
* Update `README.md` if architectural overview changes.
* Ensure `pyproject.toml` is kept clean and organized by `uv`.
