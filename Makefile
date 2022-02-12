
TEST_DIR := ./test
TESTS := $(wildcard $(TEST_DIR)/test_*.js)

.PHONY: test $(TESTS)
test: $(TESTS)

$(TESTS):
	qjs $@

