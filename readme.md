# Very Important - Fork always from Dev branch, dont branch from main-branch

# 🚀 Team Collaboration Guide (Git & GitHub)

This repository is developed **collaboratively by a team**.  
To avoid conflicts, lost work, and chaos 😅, **everyone must follow the workflow below**.

---

## 📌 Basic Rules (Read This First)
❌ **Never push directly to `main` branch**  
✅ **Always work on your own branch**  
✅ **Use Pull Requests (PRs) for merging**  
✅ **Pull latest changes before starting work**

---

## 🌱 Branching Strategy

### Main Branches
- `main` → **Stable production-ready code**
- `dev or your-branch` (optional) → Integration branch for testing

### Feature Branches (Everyone creates these)
Naming convention:
```

feature/<your-name>-<feature>
bugfix/<your-name>-<bug>

```

Examples:
```

feature/bala-auth-api
bugfix/raj-login-error

````

---

## 🛠️ How to Start Working (Step-by-Step)

### 1️⃣ Clone the repository (only once)
```bash
git clone https://github.com/<org-or-user>/<repo-name>.git
cd <repo-name>
````

---

### 2️⃣ Always switch to `main` and pull latest code

```bash
git checkout main
git pull origin main
```

This ensures your work starts from **latest stable code**.

---

### 3️⃣ Create your own branch

```bash
git checkout -b feature/your-name-feature
```

Example:

```bash
git checkout -b feature/bala-user-auth
```

---

### 4️⃣ Write code & commit changes

```bash
git add .
git commit -m "Add user authentication API"
```

✅ Write **clear commit messages**

---

### 5️⃣ Push your branch to GitHub

```bash
git push origin feature/your-name-feature
```

---

### 6️⃣ Create a Pull Request (PR)

1. Go to GitHub repository
2. Click **Compare & Pull Request**
3. Base branch → `main`
4. Add description of what you changed
5. Assign at least **1 reviewer**
6. Submit PR

🚫 **Do NOT merge your own PR unless approved**

---

## 🔍 Code Review Guidelines

Reviewers should:

* Check logic & edge cases
* Check folder structure
* Ensure no console logs / debug code
* Ensure code follows project conventions

---

## ⚔️ Merge Conflicts (Important!)

### ❓ What is a merge conflict?

A merge conflict happens when:

* Two people edit the **same file**
* Git cannot decide which change is correct

Example:

```text
<<<<<<< HEAD
console.log("Hello from main")
=======
console.log("Hello from feature branch")
>>>>>>> feature/bala-auth
```

---

### ✅ How to Resolve Merge Conflicts

#### 1️⃣ Pull latest changes

```bash
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

---

#### 2️⃣ Open conflicted file

You’ll see conflict markers:

```ts
<<<<<<< HEAD
old code
=======
your code
>>>>>>> your-branch
```

👉 Manually decide:

* Keep old code
* Keep your code
* Combine both

❌ **Delete conflict markers after fixing**

---

#### 3️⃣ Mark conflict as resolved

```bash
git add .
git commit -m "Resolve merge conflict"
git push origin your-branch
```

Then update the PR.

---

## 🧯 How to Avoid Merge Conflicts

✅ Pull from `main` **daily**

```bash
git pull origin main
```

✅ Work on **different files when possible**

✅ Keep PRs **small & focused**

❌ Don’t keep branches open for too long

---

## 🚨 Common Mistakes to Avoid

❌ Working directly on `main`
❌ Force pushing (`git push --force`)
❌ Large unreviewed PRs
❌ Ignoring merge conflicts

---

## 🧠 Golden Rule

> **If you're unsure — ASK before pushing or merging**

This keeps the codebase clean and everyone sane 🧠✨

---

Happy coding! 🚀
