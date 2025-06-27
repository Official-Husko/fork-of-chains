# 📋 List of Duties

![Version: 1.0](https://img.shields.io/badge/Version-1.0-green) ![Last  Updated: 2025-06-27](https://img.shields.io/badge/Last%20Updated-27--06--2025-blue)

This document provides a list of duties available in the game **Fort of Chains: Galvanized**. Duties are roles that units can take on, each with specific responsibilities and benefits.

## 🛠️ Important Commands

```twine
<<set _unit = $dutylist.getUnitIfAvailable('doctor')>>
<<if _unit>>
  You have a doctor <<rep _unit>>.
<<else>>
  You do not have a doctor.
<</if>>
```

```twine
<<set _unit = $dutylist.getDutySlaver('doctor', 'viceleader')>>
<<Rep _unit>> will be your doctor if you have one available,
your vice leader if you have a vice leader available but no doctor,
or some random slaver if you don't have either.
```

## 📑 Duty List

Please check the `id` of the duty from the in-game Database. The Full Vanilla will be added later.
