### RFP: Standard JavaScript Mina Wallet Provider API
### Execution Plan
  - Step-by-Step Plan:
      - Develop Provider API architecture (+UML) -- 2 days / 16 hours
      - Implement core Provider library based on RFC-0008 -- 5-6 weeks / 200-240 hours
        - Implement core, integrated with Mina blockchain -- 3 weeks / 120 hours
        - Implement provider API -- 2-3 weeks / 80-120 hours
      - Implement integration tests between Provider library, Wallet and Mina and particular unit tests -- 5 days / 40 hours 
      - Develop a test and demo zkApps to interact with the Provider API -- 2 weeks / 80 hours  
      - Provide comprehensive documentation -- 1 week / 40 hours
  
  - Critical Milestones:
    - Implement core Provider library  
    - Release a test and demo zkApp to interact with the Provider API  
    - Documentation

### RFP: Private Credential Standard
### Execution Plan
  - Step-by-Step Plan:
    - Develop architecture (+UML) -- 2 days / 16 hours
    - Implement core library based on RFC-0008/RFC-0009 -- 5-6 weeks / 200-240 hours  
        - Implement core, integrated with Mina blockchain, providing public API -- 3 weeks / 120 hours
        - Implement DSL: definition, parser, interpreter; integrate -- 1 week / 40 hours
        - Integrate library with 3rd party KYC provider -- 1-2 weeks / 40-80 hours
    - Implement integration tests and particular unit tests -- 5 days / 40 hours 
    - Develop a test and demo zkApps to interact with the Provider API -- 2 weeks / 80 hours
    - Provide documentation -- 2 weeks / 80 hours
     
  - Critical Milestones:
    - Implement core library  
    - Implement API        
    - Release a test and demo zkApp to interact with the attestation API  
    - Documentation

### RFC-0001: ZKPassport
### Execution Plan
  - Step-by-Step Plan:
    - Develop architecture (+UML) -- 2 days / 16 hours
    - Implement core library -- 5-6 weeks / 200-220 hours   
        - Develop the core library, integrated with Mina blockchain and off-chain storage, leveraging ZKP protocol -- 3 weeks / 120 hours    
        - Implement NFC (encrypted reading) and MRZ (when NFC isn't available for the document) modules, in according with ICAO Specification -- 2-3 weeks / 80-120 hours
        - Implement user interface --  
    - Implement integration tests and particular unit tests -- 7 days / 56 hours 
    - Provide documentation -- 1 week / 40 hours
     
  - Critical Milestones:
    - Implement NFC and MRZ modules
    - Implement core library
    - Documentation
