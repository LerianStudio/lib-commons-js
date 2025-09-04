## [v1.7.0-beta.4] - 2025-09-04

[Compare changes](https://github.com/LerianStudio/lib-commons-js/compare/v1.7.0-beta.3...v1.7.0-beta.4)
Contributors: Guilherme Moreira Rodrigues

### 🔧 Maintenance
- **Build/CI Pipeline**: The release pipeline has been revamped using a Node.js build and semantic release workflow. This improvement ensures more predictable release cycles and better integration with modern CI/CD practices, ultimately leading to more reliable software updates.
- **Dependencies**: Updated dependencies to enhance compatibility and security. Regular updates help maintain the system's stability and reduce vulnerability risks, contributing to a secure and robust environment.
- **Frontend**: Improved the internal build process for the frontend, resulting in faster build times and a more responsive development environment. This efficiency boost supports a smoother development workflow.


## [v1.7.0-beta.1] - 2025-09-04

[Compare changes](https://github.com/LerianStudio/lib-commons-js/compare/v1.6.0-beta.2...v1.7.0-beta.1)
Contributors: Jefferson Rodrigues, lerian-studio

### ✨ Features
- **Comprehensive Error Handling Module**: A new error handling module standardizes error reporting across the system. This enhancement helps developers diagnose issues more efficiently and provides users with clear, actionable error messages. It affects the `deps`, `frontend`, and `test` components, ensuring consistent error management throughout the application.

### 🔄 Changes
- **Enhanced Export Functionality**: The export feature in the frontend has been updated to integrate with the new error handling module. Users will now receive immediate feedback if an export operation fails, improving the reliability of data operations.

### 📚 Documentation
- **Changelog Updates**: Regular updates to the CHANGELOG file ensure that documentation remains current and useful for developers and users tracking project progress.

### 🔧 Maintenance
- **System Reliability Improvements**: The introduction of the error handling module marks a significant step towards improving the application's resilience and user feedback mechanisms.



## [v1.6.0-beta.2] - 2025-07-03

This release introduces significant enhancements in security and workflow management, alongside improvements in licensing and documentation. Users will experience a more secure and streamlined development process.

### ✨ Features
- **Authentication for NPM Hub**: We've added authentication requirements for accessing certain features on the NPM hub. This enhancement ensures that only authorized users can perform sensitive operations, significantly boosting security and protecting user data.

### 🔄 Changes
- **Workflow Management**: The backmerge flow has been disabled to simplify the development process. This change reduces workflow complexity, making it easier to manage feature branches and minimizing potential merge conflicts.

### 🔧 Maintenance
- **Licensing**: A new input license plugin has been integrated, making it easier to manage and apply licenses across projects. This improvement aids in compliance and ensures all projects meet licensing requirements effortlessly.
- **Documentation Update**: The CHANGELOG has been updated to accurately reflect all recent changes and improvements, ensuring users and developers can easily track the project's evolution.

No breaking changes were introduced in this release, ensuring full backward compatibility without requiring any user action for migration or adaptation.

## [v1.6.0-beta.1] - 2025-07-03

This release introduces a powerful new license management feature, enhancing security and compliance across the platform. With improved user interfaces and backend support, users can expect a seamless and secure experience.

### ✨ Features
- **License Management**: Implemented a comprehensive license validation system across the frontend, backend, and configuration. This ensures that users can easily validate their license keys, enhancing security and compliance. The new system provides clear guidance and feedback, making the process intuitive and user-friendly.

### 🔄 Improvements
- **Frontend Enhancements**: Updated the user interface to support the new license validation workflows. Users will notice improved feedback and guidance during the validation process, making it easier to ensure compliance.
- **Backend Support**: Integrated robust backend mechanisms for license validation, ensuring efficient and secure checks. This enhancement supports the frontend improvements and maintains data integrity.
- **Testing Expansion**: Increased test coverage to include the new license validation features, boosting system reliability and ensuring all functionalities perform as expected.

### 🔧 Maintenance
- **Dependencies Update**: Updated all project dependencies to their latest versions, improving compatibility and security. This ensures the system remains stable and benefits from the latest enhancements and patches from third-party libraries.
- **Changelog Updates**: Regular updates to the CHANGELOG file to reflect recent changes and improvements, providing users with a clear and concise history of modifications.

These updates collectively enhance the system's capabilities, particularly in license management, while maintaining stability and performance through regular maintenance and dependency updates. Users can expect a more secure and user-friendly experience with the new features and improvements.
=======
## [v1.6.0] - 2025-07-01

This release introduces a significant enhancement to package management, allowing for greater flexibility and customization in project environments.

### ✨ Features  
- **Customizable Package Naming**: You can now configure the package name for the npm repository. This feature enhances integration with various project environments, making package management more efficient and tailored to your specific needs. This customization helps streamline workflows and ensures compatibility with diverse naming conventions.

### 🔧 Maintenance
- **Changelog Updates**: We've updated the changelog to ensure you have access to the latest information about the software's evolution. This commitment to documentation helps you stay informed about new features and improvements, enhancing your overall experience with the software.

This changelog focuses on the key feature introduced in this release, highlighting its benefits and practical applications for users. The maintenance section underscores the importance of keeping documentation up-to-date, reflecting a commitment to transparency and user support.


## [v1.5.0-beta.2] - 2025-07-01

This release introduces enhanced package management capabilities and ensures up-to-date documentation for improved transparency and user experience.

### ✨ Features  
- **Configurable Package Naming on npm**: You can now customize the package name when publishing to the npm repository. This feature provides greater flexibility and helps in managing multiple packages efficiently, especially for developers adhering to specific naming conventions.

### 📚 Documentation
- **Updated Changelog**: The changelog has been refreshed to include the latest changes and improvements. This ensures that users have a clear and comprehensive history of the project's evolution, enhancing transparency and aiding in tracking the software's progress.

### 🔧 Maintenance
- **General Maintenance**: Routine updates and behind-the-scenes improvements have been made to ensure the software remains robust and reliable. These changes support ongoing stability and performance enhancements.

This changelog is designed to communicate the most relevant changes in a user-friendly manner, focusing on the benefits and impacts of the new features and maintenance updates.

## [v1.5.0-beta.1] - 2025-07-01

This release of lib-commons-js introduces significant enhancements to the library's capabilities, focusing on improving development efficiency, security, and overall performance. Users will benefit from a more robust and reliable experience.

### ✨ Features
- **Enhanced Integration Tools**: New methods have been added to the library, boosting functionality and integration capabilities. These tools streamline application development and testing, making it easier and faster for developers to build robust applications.

### ⚡ Performance
- **Optimized Build Process**: Updates to the build system and dependency management have been implemented, resulting in improved application performance and reliability. Users will experience smoother operations and reduced load times.
- **Improved Authentication Security**: The transaction validation logic has been refined, enhancing security and accuracy in authentication processes. This reduces the risk of errors and builds greater trust in transaction handling.

### 📚 Documentation
- **Updated Onboarding Guidance**: The README has been revised to provide clearer instructions and support for new users. This improvement helps users quickly understand and implement the library's features effectively.

### 🔧 Maintenance
- **Routine System Updates**: Regular updates to the build system and dependencies ensure compatibility with the latest standards, enhancing codebase maintainability.
- **Comprehensive Test Coverage**: Test cases for transaction validations have been refined, ensuring thorough coverage and reliability in the authentication component, supporting ongoing quality assurance.

Overall, this release enhances the library's functionality, performance, and security, providing users with a more efficient and reliable development experience.
=======
## [v1.5.0] - 2025-07-01

This release enhances security and streamlines the publishing process for NPM libraries, ensuring a more secure and efficient experience for developers and users.

### ✨ Features  
- **Authentication for NPM Repository**: Introduced authentication to ensure only authorized users can publish packages. This boosts security and maintains the integrity of the package distribution process, aligning with industry best practices.
  
- **Standardized NPM Library Template**: A new template for publishing NPM libraries has been introduced. This standardization simplifies the release process, providing a consistent and predictable experience for developers and users interacting with published libraries.

### 🔄 Changes
- **Release Workflow Standardization**: The publish release workflow has been standardized to improve efficiency and reduce errors. This ensures a smoother deployment pipeline, minimizing downtime and guaranteeing timely updates.

### 📚 Documentation
- **README Update**: The README.md file has been updated to reflect the latest changes and improvements, offering clearer guidance and up-to-date information for users and contributors.

### 🔧 Maintenance
- **Dependency Updates**: All project dependencies have been updated to their latest versions. This proactive maintenance enhances compatibility, leverages the latest features, and ensures security patches are applied, improving overall system stability.
  
- **Changelog Revision**: The CHANGELOG has been revised to include recent updates and improvements, providing users with a comprehensive overview of changes in this release.

**Note**: No breaking changes were identified in this release. All updates are backward-compatible, ensuring a seamless transition for users upgrading to the latest version.


## [v1.3.0-beta.2] - 2025-07-01

This release significantly enhances the security and reliability of the lib-commons-js library by introducing authentication for NPM publishing and standardizing the release workflow. These improvements ensure a more secure and streamlined experience for developers.

### ✨ Features  
- **Enhanced Security with NPM Authentication**: We've implemented authentication for the NPM repository, ensuring that only authorized users can publish packages. This change protects the integrity of the library distribution process, offering peace of mind to developers by safeguarding against unauthorized access.

### 🔄 Changes
- **Standardized Release Workflow**: The process for deploying new versions of the library has been standardized, reducing the potential for errors and ensuring consistency in version management. This streamlines the release process, making it easier and more reliable for developers to manage updates.
- **Modernized Publishing Configuration**: The library now uses a new template for publishing NPM libraries, aligning with modern standards. This update enhances the consistency and reliability of package distribution, ensuring seamless integration with frontend components and improving the overall developer experience.

### 🔧 Maintenance
- **Dependency Updates**: We've updated several dependencies to support the new authentication and publishing configurations. These updates ensure compatibility with the latest security and performance standards, maintaining the library's reliability and efficiency.

These changes focus on enhancing security, standardizing processes, and modernizing the library's infrastructure, providing significant value to developers by improving reliability and ease of use.

# [1.3.0-beta.1](https://github.com/LerianStudio/lib-commons-js/compare/v1.2.0...v1.3.0-beta.1) (2025-04-07)
=======
# [1.4.0](https://github.com/LerianStudio/lib-commons-js/compare/v1.3.0...v1.4.0) (2025-05-22)


### Features

* Added new methods ([03ef346](https://github.com/LerianStudio/lib-commons-js/commit/03ef346ddb87dbb7426f3b88ffb1aa8345c65174))

# [1.3.0](https://github.com/LerianStudio/lib-commons-js/compare/v1.2.0...v1.3.0) (2025-04-07)


### Features

* organize .releaserc.yml on YAML file ([46c88d4](https://github.com/LerianStudio/lib-commons-js/commit/46c88d4ca0a933805b174179405169d6364d66d1))

# [1.3.0-alpha.1](https://github.com/LerianStudio/lib-commons-js/compare/v1.2.0...v1.3.0-alpha.1) (2025-04-07)


### Features

* organize .releaserc.yml on YAML file ([46c88d4](https://github.com/LerianStudio/lib-commons-js/commit/46c88d4ca0a933805b174179405169d6364d66d1))

# [1.2.0](https://github.com/LerianStudio/lib-commons-js/compare/v1.1.0...v1.2.0) (2025-04-07)


### Features

* organize releaserc on N parts ([bb51e9e](https://github.com/LerianStudio/lib-commons-js/commit/bb51e9ea68a368311c111e81c1ac7bc0cc1ba4d4))

# [1.1.0](https://github.com/LerianStudio/lib-commons-js/compare/v1.0.0...v1.1.0) (2025-04-07)


### Features

* create version using semantic release ([3a415d5](https://github.com/LerianStudio/lib-commons-js/commit/3a415d55dcffbd4df777ea16f81ea90e08ac2a4b))

# 1.0.0 (2025-04-07)


### Bug Fixes

* Build ([215f98a](https://github.com/LerianStudio/lib-commons-js/commit/215f98ab869365dbaa325945e2da129487358f83))
* Build ([f120f54](https://github.com/LerianStudio/lib-commons-js/commit/f120f546f1bd1bdc8afce65d2886c3679a9262ea))
* Build on CI/CD ([d4a3685](https://github.com/LerianStudio/lib-commons-js/commit/d4a36858e8e047e8c5d3c54824754b363073be6c))


### Features

* Added pull request template ([ceab055](https://github.com/LerianStudio/lib-commons-js/commit/ceab055b19044e13d0417064bff1bad08aaab739))
* configure npm authentication ([4bf6b8b](https://github.com/LerianStudio/lib-commons-js/commit/4bf6b8b0e2135e59196f28488ff8ebd874d2556d))
* configure npm publish ([6208e34](https://github.com/LerianStudio/lib-commons-js/commit/6208e34b93776b44cfc3044e353b83a248644c5b))
* configure package.json ([d47fe87](https://github.com/LerianStudio/lib-commons-js/commit/d47fe871f4486a437cd4e3399f3a1cf2caa6875d))
* create publish step ([bbe67de](https://github.com/LerianStudio/lib-commons-js/commit/bbe67decfb8fc86e814d87938fb922d0c824d9cc))
* Initial release ([0b73939](https://github.com/LerianStudio/lib-commons-js/commit/0b73939e6ae2ffd81fad95a211dfe872c6da1adc))
* publish using manual step ([6b33454](https://github.com/LerianStudio/lib-commons-js/commit/6b334547ff0c10295832c1398e242f0c301aae47))
* test configuration with token value ([9b96762](https://github.com/LerianStudio/lib-commons-js/commit/9b96762b9ce3b3badff49e57c87b751985d76c4e))
* test configuration with token value ([0ccba38](https://github.com/LerianStudio/lib-commons-js/commit/0ccba383d9bf614570be42bce3bfce8bfa557447))
* test manual publish ([c316d5c](https://github.com/LerianStudio/lib-commons-js/commit/c316d5cc19795f18df9ce3057a59bbbcb1da94ac))
* test NPM TOKEN ([768648d](https://github.com/LerianStudio/lib-commons-js/commit/768648d972a2cebf8f0c870d517d9f992d62ea71))
* test publish packages ([c78a342](https://github.com/LerianStudio/lib-commons-js/commit/c78a342b26fa18a79d64817636aa2bfbde446539))
* test with manual publish step ([13c3d03](https://github.com/LerianStudio/lib-commons-js/commit/13c3d031aa42faadd9dd01f64875c7a8452df30a))
* test without organization ([5518b3a](https://github.com/LerianStudio/lib-commons-js/commit/5518b3a7427521f768811507d5aa10873d858ed0))
* Updated readme ([9352575](https://github.com/LerianStudio/lib-commons-js/commit/93525755a5a8d6d9cce67a1ae300e2ec8381322e))
* versioning using semantic release ([fd612ec](https://github.com/LerianStudio/lib-commons-js/commit/fd612ec7db7a2e5ba80daba5586c6fbdea4722db))
