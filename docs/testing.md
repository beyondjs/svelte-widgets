# Testing

This repository has no tests: no test files, fixtures, runner or command. The Svelte framework controllers are exercised from another repository: the command line's `web` acceptance in the `cli` repository (an optional external reference) mounts a Svelte widget in a real browser and verifies mounting, stylesheet adoption in the root, a script refresh through the original import and teardown. [Verification and extension](architecture.md#verification-and-extension) lists what that acceptance verifies and what remains to be verified.

## Levels and commands

| Level | Location | Command | What it establishes |
| --- | --- | --- | --- |
| Contract/unit and integration | None in this repository | None | Nothing |
| Browser acceptance | `cli` repository, the `web` acceptance | Its README | The cases [verification and extension](architecture.md#verification-and-extension) names as verified |

## Exceptions and limits

- Missing-component errors, style failure, CSS refresh of a Svelte widget, query-string events, detach and reconnect, and server output followed by hydration are not verified; the Svelte hydration path in particular is unverified.
- Whoever adds tests here follows the section below and names the compiler, runtime and browser a run exercises.

## Test organization and source fixtures

These rules are shared by every Beyond repository.

- Contract/unit and integration tests live in `test/` or `tests/`; complete journeys against an installed, composed or exported product live in `acceptance/`, with a README of their own. Harness infrastructure (servers, registries, process lifecycle, copying and substitution) lives in a `support/` directory of the consuming area.
- Applications, packages, modules, documents and assets a test exercises are checked-in files with their real extensions and directory structure under the consuming area's `fixtures/`. Each fixture group has a README naming its purpose, entry modules, the tests that use it, their command, the expected behavior and any intentionally invalid part. A reader inspects the example without running or decoding a generator.
- A harness copies the fixtures it runs or edits to a unique temporary directory, substitutes only explicit values such as versions, ports or origins, and never writes the checked-in files, even when a run fails. Credentials, machine paths and build output are never fixture source.
- Small input values, expected values, protocol payloads and short edits stay inline. Source is generated only when generation is the behavior under test (size or memory stress, combinations, deliberately malformed input); the guide states why, the parameters that reproduce it and how to inspect what was generated.
- Fixtures stay out of the repository's production compilation, discovery and packaging.
- Migrating a test preserves its scenario identities, its positive, negative and recovery cases and its real execution path; an existing failure stays reported as a failure.
