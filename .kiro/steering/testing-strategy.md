---
inclusion: fileMatch
fileMatchPattern: "**/*.{py,js,ts,test.js,test.ts,spec.js,spec.ts}"
---

# Testing Strategy

## Philosophy: Test Always, Pragmatically

Testing is essential, but pragmatism matters. Focus on tests that provide real value and catch real bugs.

## What to Test

### Always Test
- **Core business logic** - The functions that matter most
- **Public APIs** - Interfaces other code depends on
- **Error handling** - Ensure failures are handled correctly
- **Security boundaries** - Authentication, authorization, input validation
- **Data transformations** - Parsing, serialization, calculations
- **Integration points** - External services, databases, APIs

### Test Pragmatically
- **Edge cases** - Boundary conditions, empty inputs, null values
- **Happy paths** - Normal operation flows
- **Critical user journeys** - End-to-end scenarios that matter
- **Regression prevention** - Tests for bugs you've fixed

### Don't Over-Test
- **Implementation details** - Test behavior, not internals
- **Framework code** - Don't test the framework
- **Trivial getters/setters** - Unless they have logic
- **Generated code** - Unless you wrote the generator

## Test Types

### Unit Tests
- Test individual functions/methods in isolation
- Fast, focused, independent
- Mock external dependencies
- Run frequently during development

**Python Example (pytest):**
```python
import pytest
from myapp.calculator import calculate_total

def test_calculate_total_with_valid_items():
    """Test total calculation with valid items."""
    items = [
        {"price": 10.00, "quantity": 2},
        {"price": 5.50, "quantity": 1}
    ]
    
    result = calculate_total(items)
    
    assert result == 25.50

def test_calculate_total_with_empty_list():
    """Test total calculation with empty list."""
    result = calculate_total([])
    assert result == 0.0

def test_calculate_total_raises_on_invalid_item():
    """Test that invalid items raise appropriate errors."""
    items = [{"price": "invalid"}]
    
    with pytest.raises(ValueError):
        calculate_total(items)
```

**JavaScript Example (Jest):**
```javascript
const { calculateTotal } = require('./calculator');

describe('calculateTotal', () => {
    test('calculates total with valid items', () => {
        const items = [
            { price: 10.00, quantity: 2 },
            { price: 5.50, quantity: 1 }
        ];
        
        const result = calculateTotal(items);
        
        expect(result).toBe(25.50);
    });
    
    test('returns 0 for empty list', () => {
        expect(calculateTotal([])).toBe(0);
    });
    
    test('throws error for invalid items', () => {
        const items = [{ price: 'invalid' }];
        
        expect(() => calculateTotal(items)).toThrow(ValueError);
    });
});
```

### Integration Tests
- Test components working together
- Use real dependencies when practical
- Test actual database queries, API calls
- Slower but catch real integration issues

**Python Example:**
```python
import pytest
from myapp.database import Database
from myapp.service import OrderService

@pytest.fixture
def db():
    """Create test database."""
    db = Database(":memory:")  # SQLite in-memory
    db.setup_schema()
    yield db
    db.close()

def test_order_service_creates_order(db):
    """Test order creation through service layer."""
    service = OrderService(db)
    
    order_id = service.create_order(
        user_id="user123",
        items=[{"sku": "ITEM1", "quantity": 2}]
    )
    
    # Verify order was created in database
    order = db.get_order(order_id)
    assert order is not None
    assert order["user_id"] == "user123"
    assert len(order["items"]) == 1
```

### End-to-End Tests
- Test complete user workflows
- Use sparingly (slow, brittle)
- Focus on critical paths
- Automate when stable

## Test Organization

### File Structure
```
project/
├── src/
│   ├── calculator.py
│   └── service.py
├── tests/
│   ├── unit/
│   │   ├── test_calculator.py
│   │   └── test_service.py
│   ├── integration/
│   │   └── test_service_integration.py
│   └── e2e/
│       └── test_user_workflows.py
```

### Naming Conventions
- Test files: `test_*.py` or `*.test.js`
- Test functions: `test_<what>_<condition>_<expected>`
- Be descriptive: `test_calculate_total_with_negative_price_raises_error`

## Coverage: Pragmatic Approach

### Don't Chase 100%
- Aim for high coverage of critical code
- 70-80% is often sufficient
- Focus on meaningful tests, not coverage numbers
- Some code doesn't need tests (simple getters, config)

### Measure What Matters
- Track coverage trends over time
- Ensure new code has tests
- Focus on uncovered critical paths
- Use coverage to find gaps, not as a goal

## Test Best Practices

### Write Clear Tests
```python
def test_user_registration_with_duplicate_email():
    """
    Test that registering a user with an email that already exists
    raises a DuplicateEmailError and doesn't create a new user.
    """
    # Arrange
    existing_user = create_user(email="test@example.com")
    
    # Act & Assert
    with pytest.raises(DuplicateEmailError):
        create_user(email="test@example.com")
    
    # Verify no duplicate was created
    users = get_users_by_email("test@example.com")
    assert len(users) == 1
```

### Follow AAA Pattern
- **Arrange**: Set up test data and conditions
- **Act**: Execute the code being tested
- **Assert**: Verify the results

### Keep Tests Independent
- Each test should run in isolation
- Don't depend on test execution order
- Clean up after tests (fixtures, teardown)

### Make Tests Fast
- Mock slow dependencies (network, disk)
- Use in-memory databases for integration tests
- Parallelize when possible
- Keep test data minimal

### Test Error Cases
```python
def test_api_handles_network_timeout():
    """Test that network timeouts are handled gracefully."""
    with mock.patch('requests.get', side_effect=Timeout):
        result = fetch_data_with_retry(url="http://api.example.com")
        
        # Should return None or default value, not crash
        assert result is None
```

## Testing Tools

### Python
- **pytest**: Primary testing framework
- **pytest-cov**: Coverage reporting
- **pytest-mock**: Mocking utilities
- **hypothesis**: Property-based testing (when appropriate)

### JavaScript
- **Jest**: Primary testing framework
- **Testing Library**: For React/UI components
- **Supertest**: For API testing
- **MSW**: Mock Service Worker for API mocking

### PowerShell
- **Pester**: PowerShell testing framework
- Built-in mocking capabilities

## CI/CD Integration

### Run Tests Automatically
- On every commit (unit tests)
- On pull requests (full suite)
- Before deployment (smoke tests)
- Scheduled (integration tests)

### Fail Fast
- Stop build on test failures
- Don't deploy broken code
- Make failures visible

## When to Skip Tests

It's okay to skip tests for:
- Proof of concept code
- Throwaway scripts
- Simple configuration files
- Code you're about to delete

But always test:
- Production code
- Shared libraries
- Critical business logic
- Security-sensitive code

## Remember

> "Testing shows the presence, not the absence of bugs." - Dijkstra

Tests are a tool, not a goal. Write tests that:
- Catch real bugs
- Give you confidence to refactor
- Document expected behavior
- Run fast enough to use frequently
- Are maintainable and clear
